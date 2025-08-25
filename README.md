<img width="1280" height="720" alt="JobAI" src="https://github.com/user-attachments/assets/486ab424-555e-4c0a-8f76-985b545a9f0b" />

# What it is
It's a tool that aims to simplify the job application process for teens. That way they can be on their way to financial independence quicker (it's all about the l'argent)! It does the following things through one unified chat interface:
- Scrapes LinkedIn for jobs based on the location and the type of job the user is looking for (e.g. Restaurant Manager).
- Create's a downlodable PDF of a résumé based on what the user wants in it
- Generates interview questions that may be asked based on the job description from LinkedIn
- Give feedback to answers given to those interview questions

# How does it address the theme?
Since the theme is "Independence" we decided to go down the route of helping teens gain financial independence. The reason for this is because it can really open up a lot of oppurtunities in the short term and in the long term it teaches them how to becoming financially responsible or how to deal with any of the other responsibilities that come with being an independent adult.

# How is this scalable?
Since we used MCP and agents (discussed further below), it makes it really easy to hook up external APIs to the LLM for extra context or to give it more features. Like if we wanted it to be able to write an email draft in the user's inbox then we can use something like Zapier (or make our own MCP server for Gmail) and just add it to the list of MCP servers.

# How is this engaging?
Teens spend a fair bit of time on their phones, specifically with chat interfaces. Since they're already familiar with these interfaces we made JobAI completely chat based that way there essentially no learning curve to using the app. It's also more engaging to talk to an AI that can understand you better rather than having to click buttons and dropdown and everything else that comes with doing a job search and application.

# Cool screenshots
<img width="1274" height="417" alt="image" src="https://github.com/user-attachments/assets/47ab9637-fa69-46e2-82b2-34a48b7657f8" />
<img width="719" height="894" alt="image" src="https://github.com/user-attachments/assets/fa4337d7-ced9-4635-8ad9-f36f771dbde9" />
<img width="1019" height="1431" alt="image" src="https://github.com/user-attachments/assets/8fbf0a9c-631d-427a-a36c-5be502a69c85" />

# How it works
It uses agents created using Langchain to interface over an MCP server so it can use tools that do things like scrape LinkedIn for data. Here's a little diagram:

<img width="881" height="1133" alt="image" src="https://github.com/user-attachments/assets/420f295d-a4c7-4528-89c7-e1d148c1eaea" />
