import api from './api.js'

// auth is for adding logic


export default {
    createAccount(firstName, lastName, email, password) {
        
            return api.createAccount(firstName, lastName, email, password)
                // .then(resp =>
                //     localStorage.userObject = JSON.stringify(resp.body))
    
        // if there's a token, then you shouldnt be able to sign up;
        // check if token, throw error, else, call api.signup
        // need to put user object from database that includes user id into local storage,


    },

    login(email, password) {
            return api.requestLogin(email, password)
                .then(resp => localStorage.token = resp.body.token)
                .then(resp => api.requestUserObject(this.getToken()))
                .then(resp => localStorage.userObject = JSON.stringify(resp.body))
                
                // .to do make an api call to /api/auth/me (get) that returns
                // full user object, with that response save into local storage userobject
        
    },

    getToken() {
        return localStorage.token;
    },

    getUser() {
        return localStorage.userObject ?
         JSON.parse(localStorage.userObject)
        : null

        // return local storage. user

        //to do: instead of pulling from loo
    },

    logOut(token) {
       return api.requestLogout(token)
            .then(() => {
                delete localStorage.token;
                delete localStorage.userObject
            })
            .catch((err) => {
                delete localStorage.token;
                delete localStorage.userObject
            })

        //removes token / user form local storage
        // call to the server to do something, probably delete
        // delete / set
    },

    isLoggedIn() {
        //returns !!localStorage.token
    }
}
