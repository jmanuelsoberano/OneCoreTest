using Microsoft.EntityFrameworkCore;
using OneCoreTest.Domain;
using System;

namespace OneCoreTest.Data
{
    public class OneCoreTestDbContext : DbContext
    {
        public OneCoreTestDbContext(DbContextOptions<OneCoreTestDbContext> options)
            : base(options)
        {
        }

        public DbSet<User> Users { get; set; }
    }
}
