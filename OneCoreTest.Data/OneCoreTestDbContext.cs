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

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder
                .Entity<User>()
                .Property(e => e.CreationDate)
                .HasDefaultValueSql("getdate()");
        }
    }
}
