### Scraper Setup

Make sure you have `pip` installed in your device.

Simply type `pip install <package_name>`. The list of libraries and packages include:
- bs4
- selenium

## Running the scraper

Go to the scraper folder directory and type `python courseScraper.py` in your terminal. You might have to type `python3` if you are in MacOS.


## Seeding the data into the database

Go to the prisma folder in the backend directory. Run `seed.ts` on your terminal. Make sure the database is empty beforehand, otherwise the function would crash.