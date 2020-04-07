class UserService {
    userList = [
    ];

    RegisterUser(username, password)
    {
        if(username && username.length >= 4 && password && password.length >= 4)
        {
            //duplicate check
            this.userList.push({username, password});
            return true;
        }
        else
        {
            return false;
        }
    }

    LoginUser()
    {
        //Do Login Routine here
    }

    GetRegisteredUsers()
    {
        return this.userList;
    }
}

module.exports = UserService;