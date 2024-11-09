from flask import Flask, request, jsonify
from langchain.chat_models import ChatOpenAI
from langchain.chains import LLMChain
from langchain.prompts import PromptTemplate
import os

app = Flask(__name__)


# Set up the ChatGPT model
llm = ChatOpenAI(model_name="gpt-4o-mini", api_key=os.getenv("OPENAI_API_KEY"))

# Define prompt for generating Twitter threads
template = """
You are a social media expert. Create a Twitter thread based on this webpage content:

{content}

Cover all key points of the webpage. Make sure each tweet is concise and engaging, fitting within 280 characters, and split the content into multiple tweets.
Do not self reference. Do not explain what you are doing. Don't add emojis or hashtags. Remove all promotional content.
Do not add any reference of author or webpage you are usinging in the final tweets.
"""

prompt = PromptTemplate(input_variables=["content"], template=template)
llm_chain = LLMChain(llm=llm, prompt=prompt)

@app.route("/generate_thread", methods=["POST"])
def generate_thread():
    data = request.json
    content = data["content"]
    
    # Generate Twitter thread
    result = llm_chain.run(content)
    
    # Split on double newlines to preserve paragraph structure
    raw_tweets = result.split('\n\n')
    tweets = []
    
    current_tweet = ""
    for segment in raw_tweets:
        # If segment is too long, split on sentences
        if len(segment) > 280:
            sentences = segment.replace('. ', '.|').split('|')
            for sentence in sentences:
                if len(current_tweet + " " + sentence) <= 280:
                    current_tweet = (current_tweet + " " + sentence).strip()
                else:
                    if current_tweet:
                        tweets.append(current_tweet)
                    current_tweet = sentence.strip()
        else:
            if len(current_tweet + " " + segment) <= 280:
                current_tweet = (current_tweet + " " + segment).strip() 
            else:
                if current_tweet:
                    tweets.append(current_tweet)
                current_tweet = segment.strip()
    
    # Add final tweet if exists
    if current_tweet:
        tweets.append(current_tweet)
    
    return jsonify({"thread": tweets})

if __name__ == "__main__":
    app.run(port=8000)
