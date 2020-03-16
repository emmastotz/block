from datetime import datetime
import logging
import math
import os
import re
import json
from bs4 import BeautifulSoup
import requests
# from mysql.connector import MySQLConnection, Error
import mysql.connector

# from python_mysql_dbconfig import read_db_config
# from .utils.log import get_logger
# logger = get_logger(os.path.basename(__file__))
URL_ROOT = 'https://www.ratemyprofessors.com'
URL_PROF_SEARCH ='https://www.ratemyprofessors.com/search.jsp?queryoption=HEADER&queryBy=teacherName&schoolName=University+of+Mary+Washington&schoolID=568&query='

def soupify_page(url):
    try:
        r = requests.get(url)
    except Exception as e:
        # logger.critical(f'Exception making GET to {url}: {e}', exc_info=True)
        return
    content = r.content
    soup = BeautifulSoup(content, 'html.parser')

    return soup   

def main():
    cnx = mysql.connector.connect(user='root', password= 'root', database='block_db')
    cursor = cnx.cursor()
    query = ("SELECT * FROM instructors")
    cursor.execute(query)
    profs = []

    for (rows) in cursor:
            query_name = rows[1][:-1].split(" ")[0]
            query_name = query_name.strip()
            # print(URL_PROF_SEARCH + query_name)
            soup = soupify_page(URL_PROF_SEARCH + query_name)
            # Prints the soup of the website at the target passed. In the below print this returns the website from all the profs found from the above search.
            # print(soup)
            # Get the LI corresponding to the profs found
            prof_list = soup.find('li', {"class" : "listing PROFESSOR"})
            try:
                prof_rating_website_url = prof_list.find("a").get("href")
                # print(prof_rating_website_url)
                target = URL_ROOT + prof_rating_website_url
                target = target.strip()
                prof_rating_soup = soupify_page(target)
                # print(prof_rating_soup)
                #RatingValue__Numerator-qw8sqy-2 gxuTRq
                prof_rating_value = prof_rating_soup.find("div", {"class" : "RatingValue__Numerator-qw8sqy-2"})
                prof_rating_value = prof_rating_value.text
                prof_feedback_soup = prof_rating_soup.findAll("div", {"class" : "FeedbackItem__FeedbackNumber-uof32n-1"})
                prof_difficulty = prof_feedback_soup[1].text
                prof_retake_rate = prof_feedback_soup[0].text
                prof_instance = {
                    "id": rows[0],
                    "rating": prof_rating_value,
                    "take_again": prof_retake_rate,
                    "difficulty": prof_difficulty
                }
                
                profs.append(prof_instance)
            except Exception as e:
                # logger.critical(f'Exception making GET to {url}: {e}', exc_info=True)
                continue

    for row in profs:
        id = row['id']
        rating = round(float(row['rating']),2)
        difficulty = round(float(row['difficulty']),2)
        take_again = float(row['take_again'].replace("%",""))
        take_again = round(take_again / 100.00,2)
        query = f"UPDATE instructors SET rating = {rating}, difficulty= {difficulty}, take_again_percent={take_again} WHERE id = {id}"
        cursor.execute(query)
    
    cnx.commit()
    cursor.close()
    cnx.close()
    return profs


if __name__ == '__main__':
#     logging.basicConfig(
#         level=logging.INFO,
#         format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
#     )
    profs = main()
    # print(json.dumps(profs, indent=4, sort_keys=True))