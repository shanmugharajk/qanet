# QaNet
Question answer site with minimal features like stack overflow built with dotnet core web-api and angular6.

### Update
Currently I am updating the projecting to golang, postgres using web framework buffalo https://github.com/gobuffalo/buffalo
and gorm orm http://gorm.io. The developement happens in develop branch.

### Demo
https://qanet.herokuapp.com/

### Workflow
- Any user can view, search all the questions posted.
- Signed user's can ask new question, answer to the question's asked, add comments.
- Good questions and answers will be rewarded with votes.
    
      Question
        Upvote   - The user who posted the question will get 2 points.
        Downvote - The user who posted the quetsion will get 2 negative points.
      
      Answer
        Upvote           - The user who answered the question will get 5 points.
        Downvote         - The user who answered the question will get 5 negative points.
        Accepting answer - The user who answered the question will get 10 points.
        
- User should have minimum reputation of 25 points to perform upvote and 125 points to perform down vote.
      
- Signed-up users can bookmark the questions and the list of bookmarks can be accessed from their profile menu.

### TODO
** Needs to update **

### Roadmap

** Needs to update **

### Screen shots

#### Home

<img width="1440" alt="home" src="https://user-images.githubusercontent.com/11159061/43876913-c4dce28c-9bb4-11e8-9d89-3ae23c2e2555.png">

#### Question Detail

<img width="1440" alt="question" src="https://user-images.githubusercontent.com/11159061/43876911-c4acbfe4-9bb4-11e8-82ad-00af03712513.png">
