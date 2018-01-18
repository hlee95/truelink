# truelink-backend

This repository contains the Node.js backend that supports the iOS frontend and the lamp device.

The server is currently hosted at https://limitless-lowlands-74122.herokuapp.com/

### Object Types
When interacting with the server, there are several object types to keep in mind.

##### Lamp object
The `Lamp` object represents a lamp in the system. Signals are sent between lamps. Each lamp is paired with another lamp, and this is hardcoded in the Arduino software, so each lamp knows its own identity and the identity of its partner. Users of the app can own a lamp, and assign nicknames and timezones to their partner's lamp for easier recognition. The `Lamp` object has the following fields:

    {
        lamp_id: String, // Id of the lamp, should be a serial number on the hardware
        arduino_address: String // Address of the arduino server that should receive messages for this lamp
        partner_lamp_id: String // Id of the partner lamp, also hardcoded
        
        user_id: String, // Id of the app user who owns the lamp, if such a user exists

        nickname: String, // Lamp nickname, set by app user of the paired lamp
        timezone: Number, // Timezone of the lamp
        image_url: String, // An image that an app user sets for the owner of this lamp
    }

##### User object
The `User` object represents a user of the app. Every user must have at least one lamp, but not every lamp has a user (because not every lamp owner will download the app). A `User` object has the following fields:

    {
        "user_id": String,
        "name": String,
        "email": String,
        "password_hash": String,
        "phone_id": String // Information necessary to send push notifications
    }

##### Itay object
The `Itay` object (which stands for "I'm thinking about you") represents a signal sent from one lamp owner to another lamp owner. The owners are identified by their `lamp_id`, regardless of if the itay was sent from an app or from a lamp. It has the following fields:

    {
        sender_id: String, // The lamp_id of the sender
        recipient_id: String, // The lamp_id of the recipient
        sent_time: Date,
    }

## REST API
This is the API that an app or lamp Arduino should interface with.

### /user
1. To create a new user, send a `POST` request to `/user` with the following body:

        {
            name: String,
            email: String,
            password: String,
            phone_id: String, // Mobile device id, whatever's needed to send notifications
        }
    
    and the response body will be:
    
        {
            user_id: String // Id of the newly created user
        }


2. To get all connections for a particular user, send a `GET` request to `/user/:user_id`, and the response body will be simply an array of `Lamp` objects representing the user's connections: 

        [Lamp]

3. To pair a user to a lamp, send a `PUT` request to `/user/:user_id` with a `user_id` parameter and the following body:

        {
            "lamp_id": String
        }
    and the response body will be the modified user and lamp:
    
        {
    		"user": User,
    		"lamp": Lamp
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
        connections: [Lamp] // Array of lamp objects
    }
    
### /lamp

1. To activate/register a new lamp (without pairing it to an app yet), send a `POST` request to `/lamp` with the following body: 

        {
            lamp_id: String,
            arduino_address: String,
            partner_lamp_id: String,
        }
        
    and the response body will be:

        Lamp // Newly created lamp object
        
2. To update an existing lamp, for the purpose of customization of nickname or image or timezone, send a `PUT` request to `/lamp/:lamp_id` with a `lamp_id` parameter and the following body:
    
        {
            nickname: String, // Optional
            timezone: String, // Optional
            image_url: String // Optional
        }

    This will update any fields in the request body. The response body will be the updated `Lamp` object.

		Note that this request is NOT meant to pair a user to a lamp. For that functionality, see `PUT /user/user_id` above.

3. To retrieve all lamps, send a `GET` request to `/lamp`. The response body will be an array of lamps:

				[Lamp]


#### /itay
1. To get all itays for a particular lamp, send a `GET` request to `/itay_lamp/:lamp_id` with a `lamp_id` parameter and no body, and the response will be an array of `Itay` objects:
    
        [Itay]

2. To get all itays for a particular app user, which will include all itays for any lamps the user owns, send a `GET` request to `/itay_user/:user_id` with a `user_id` parameter and no body, and the response will be an array of `Itay` objects:

        [Itay]

3. To add (send) a new itay, send a `POST` request to `/itay` with the following body:

        {
            // Note: both `sender_id` and `recipient_id` should be `lamp_id`s not `user_id`s.
            sender_id: String, 
            recipient_id: String,
        }

    and the response body will be:
    
        {
            itay_id: String // Id of the newly created itay
        }

4. To retrieve all itays, send a `GET` request to `/itay`, and the response body will be an array of `Itay` object:

				[Itay]

### Team
This work was completed as part of a team project by HPJAMS.








