I implemented security practices to my application. Here is explanation of them below:

1.	Authentication provided by Firebase. It offers various methods of users authentication such as email/password, phone/password, google account and etc. For my app I selected email/password authentication: 
2.	After login for user generates JWT token that is need in all server operations to enusere user authentication. And at each request to server in client side sends JWT token to approving. If someone without credentials will be trying to access to system, server will returns response with status 401 Unauthorized. It means that it works well.
3.	HTTPS
4.	Also I added user data validation on client side. So, that enusre that to server never will come some empty data or data with errors. But there is also some validations on the server. It servers as a last check to verify that data can be added to database for example. 
5.	And finally, I guess that without monitoring tools any security procedures will be weak. So, I created Cloud Function that send notification to logs at each user action. It gives an opportunity to track user actions in the system and respond to any incidents in a timely manner.
