using OneCoreTest.Domain;
using System;
using System.Collections.Generic;

namespace OneCoreTest.Service
{
    public interface IOneCoreTestRepository
    {
        IEnumerable<User> GetUsers();
        User GetUser(Guid id);
        void AddUser(User user);
        void UpdateUser(User user);
        void DeleteUser(User user);
        bool Save();
        bool ExistingUser(User user);
    }
}
