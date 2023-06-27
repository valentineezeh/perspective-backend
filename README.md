# Perspective Backend Engineer Worksample

Good day!

This is the code part to the written work sample. In here you can find a simple setup on how to consume a queue. 
The tests are working, so you can run `npm test` and start from there.

In the `/samples` folder you can find multiple sample messages which you can feed to your system. 


## Goal
1. You create a `Session` model in MongoDB (preferred with Mongoose). It needs to have one added property `profile` which type this property has is not defined. (You can define it)
2. You provide one function / query / aggregation which gets a session ID as parameter and returns the latest information about the session, take special care about the `profile` property!
3. We expect from your service that it takes the job data and creates or updates a session based on the job's `clientSessionId` property.

Feel free to add or change this project as you like.


