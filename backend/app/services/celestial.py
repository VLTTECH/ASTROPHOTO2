from astropy.coordinates import SkyCoord, EarthLocation, AltAz
from astropy.time import Time
from astroquery.simbad import Simbad
import astropy.units as u
import requests

class CelestialMath:
    @staticmethod
    def get_city_location(city_name: str):
        """
        Queries Open-Meteo (more permissive than OSM) to get Lat/Lon for a city.
        """
        import urllib.parse
        try:
            city_encoded = urllib.parse.quote(city_name)
            url = f"https://geocoding-api.open-meteo.com/v1/search?name={city_encoded}&count=1&language=pt&format=json"
            r = requests.get(url)
            if r.status_code == 200:
                resp = r.json()
                if "results" in resp and len(resp["results"]) > 0:
                    data = resp["results"][0]
                    return {
                        "lat": float(data["latitude"]),
                        "lon": float(data["longitude"]),
                        "mag_dec": -21.0 # Ex: Declinação magnética padrão BR
                    }
            else:
                print(f"Open-Meteo returned status {r.status_code}")
        except Exception as e:
            print("Error in geocoding city lookup:", e)
            return None
        return None

    @staticmethod
    def get_target_coordinates(target_name: str, lat: float, lon: float):
        """
        Fetches J2000 RA/Dec from Simbad and computes current AltAz if needed.
        """
        try:
            result_table = Simbad.query_object(target_name)
            if result_table is None:
                return None
                
            ra_str = result_table['RA'][0]
            dec_str = result_table['DEC'][0]
            
            # Convert to degrees for frontend easier display
            c = SkyCoord(f"{ra_str} {dec_str}", unit=(u.hourangle, u.deg))
            return {
                "ra_str": ra_str,
                "dec_str": dec_str,
                "ra_deg": c.ra.deg,
                "dec_deg": c.dec.deg
            }
        except Exception as e:
            print("Error resolving target:", e)
            return None

    @staticmethod
    def calculate_equatorial_correction(solved_ra: float, solved_dec: float, target_ra: float, target_dec: float, mag_dec: float = 0.0):
        """
        Calculates how many degrees to move the mount:
        - Dec determines North/South
        - RA determines East/West 
        """
        # Simplistic calculation for MVP
        delta_ra = target_ra - solved_ra
        delta_dec = target_dec - solved_dec

        ns_dir = "Norte" if delta_dec > 0 else "Sul"
        ew_dir = "Leste" if delta_ra > 0 else "Oeste"
        
        # Compensate for magnetic declination if we were giving bearing, but for equatorial RA/Dec is absolute to celestial pole.
        # We include it in notes.
        
        return {
            "ns_direction": ns_dir,
            "ns_degrees": abs(round(delta_dec, 4)),
            "ew_direction": ew_dir,
            "ew_degrees": abs(round(delta_ra, 4))
        }
