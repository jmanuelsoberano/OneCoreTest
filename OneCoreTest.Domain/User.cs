using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace OneCoreTest.Domain
{
    [Table("User", Schema = "dbo")]
    public class User
    {
        [Key()]
        public Guid Id { get; set; }
        public string Email { get; set; }
        public string Name { get; set; }
        public string Password { get; set; }
        public bool Status { get; set; }
        public string Gender { get; set; }
    }
}
