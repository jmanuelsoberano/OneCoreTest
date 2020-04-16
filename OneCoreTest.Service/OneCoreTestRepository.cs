using OneCoreTest.Data;
using OneCoreTest.Domain;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace OneCoreTest.Service
{
    public class OneCoreTestRepository : IOneCoreTestRepository, IDisposable
    {
        public readonly OneCoreTestDbContext _context;

        public OneCoreTestRepository(OneCoreTestDbContext context)
        {
            _context = context ?? throw new ArgumentException(nameof(context));
        }

        public void AddUser(User user)
        {
            if (user == null)
            {
                throw new ArgumentNullException(nameof(user));
            }
            _context.Users.Add(user);
        }

        public void DeleteUser(User user)
        {
        }

        public User GetUser(Guid id)
        {
            if (id == Guid.Empty)
            {
                throw new ArgumentNullException(nameof(id));
            }

            return _context.Users
                .Where(c => c.Id == id)
                .FirstOrDefault();
        }

        public IEnumerable<User> GetUsers()
        {
            return _context.Users
                .OrderBy(c => c.Name)
                .ToList();
        }

        public void UpdateUser(User user)
        {
        }

        public bool Save()
        {
            return (_context.SaveChanges() >= 0);
        }

        public void Dispose()
        {
            Dispose(true);
            GC.SuppressFinalize(this);
        }

        protected virtual void Dispose(bool disposing)
        {
            if (disposing)
            {
                // dispose resources when needed
            }
        }

    }
}
