from bs4 import BeautifulSoup
from selenium import webdriver
import json
import requests
import re
import time

url = "https://unilectives.devsoc.app/"
driver = webdriver.Chrome()
file_path = 'courseCodesAndTitle.json'

print('---------------------------')
print('Start of file')

# Load in the page to scrape
driver.get(url)
time.sleep(5)

# Scroll down to load more content
last_height = driver.execute_script("return document.body.scrollHeight")
while True:
    driver.execute_script("window.scrollTo(0, document.body.scrollHeight);")
    time.sleep(1) 
     
    new_height = driver.execute_script("return document.body.scrollHeight")
    if new_height == last_height:
        break
    
    last_height = new_height

try:
    print('Response success... Reading HTML content...')
    soup = BeautifulSoup(driver.page_source, 'html.parser')
    
    course_objects = []
    course_card_class = "box-border px-6 py-7 bg-unilectives-card dark:bg-slate-700/40 hover:bg-gray-100 dark:hover:bg-slate-700/10 shadow-lg rounded-xl space-y-2 cursor-pointer duration-150"
    course_card_elements = soup.find_all('div', course_card_class)
    
    for course_card in course_card_elements:
        course_object = {}
        course_object['Code'] = course_card.find("h2", class_="font-bold w-[8ch] text-black dark:text-white").text
        course_object['Title'] = course_card.find("p", class_="text-sm text-unilectives-headings dark:text-gray-200 h-16 line-clamp-3").text
        course_objects.append(course_object)
        
    with open(file_path, 'w') as file:
      json.dump(course_objects, file, indent=2) 
      
except Exception as e:
    print(f"An error occurred: {e}")
    
driver.quit()
print('---------------------------')