# truelink

This repository contains the Node.js backend that supports the iOS frontend and the lamp device.

The server is currently hosted at https://limitless-lowlands-74122.herokuapp.com/

When interacting with the server, there are several object types to keep in mind.
##### Connection object
The `Connection` object represents a connection or contact that the app user has saved. The contact is most likely a parent or loved one. Each contact is paired with a lamp device. The `Connection` object has the following fields:

    {
        user_id: String,
        timezone: Number,
        name: String,
        image_url: String,
        device_id: String // Id of the paired hardware lamp device.
    }

##### Itay object
The `Itay` object (which stands for "I'm thinking about you") represents a signal sent from the app to the lamp device or vice versa. It has the following fields:

    {
        user_id: String,
        connection_id: String,
        sent_time: Date,
        acked_time: Date,
        to_phone: Boolean, // True if from device -> phone, otherwise false.
        acked: Boolean,
    }

## REST API
#### /create_user
To create a new user, send a `POST` request to `/create_user` with the following body:

    {
        name: String,
        email: String,
        password: String,
        phone_id: String, // Mobile device id
    }

and the response body will be:

    {
        user_id: String // Id of the newly created user
    }

#### /login
To attempt login, send a `POST` request to `/login` with the following body:
    
    {
        email: String,
        password: String
    }
    
If the login request is invalid, the server will respond with a `401` error. If the login request is valid, the response body will be:

    {
        user_id: String,
        name: String,
        connections: [Connection] // Array of connection objects
    }
    
#### /connection

1. To get all connections for a particular user, send a `GET` request to `/connection/:user_id`, and the response body will be simply an array of `Connection` objects: 

        [Connection]

2. To add a new connection, send a `POST` request to `/connection` with the following body: 

        {
            user_id: String,
            name: String,
            device_id: String,
            timezone: Int, // Optional
            image_url: String // Optional
        }
        
    and the response body will be:

        {
            connection_id: String // Id of the newly created connection
        }
        
3. To update an existing connection, send a `PUT` request to `/connection/:connection_id` with a `connection_id` parameter and the following body:
    
        {
            name: String, // Optional
            device_id: String, // Optional
            timezone: Int, // Optional
            image_url: String // Optional
        }

    This will update any fields in the request body and can be used to change the `device_id` and `timezone` of the connection, if for example the person moves to a new location or gets a new lamp device. The response body will be simply the new `Connection` object:

4. To remove a connection, send a `DELETE` request to `/connection/:connection_id` with a `connection_id` parameter. The response body will be the removed `Connection` object.

#### /itay
1. To get all itays for a particular user, send a `GET` request to `/itay/:user_id` and the response will be an array of `Itay` objects:
    
        [Itay]

2. To add a new itay, send a `POST` request to `/itay` with the following body:

        {
            user_id: String,
            connection_id: String,
            to_phone: Boolean, // True if the itay is from lamp -> phone
        }

    and the response body will be:
    
        {
            itay_id: String // Id of the newly created itay
        }

3. To update an itay, and specifically to mark it as acknowledged, send a `PUT` request to `/itay/:itay_id` with the `itay_id` parameter and the following body:

        {
            acked: Boolean
        }

    and the response body will be the updated `Itay` object.
    
### Team
This work was completed as part of a team project by HPJAMS.








