using System;
using System.Collections.Generic;
using System.Text;

namespace OneCoreTest.Domain
{
    public class UserAuth
    {
        public string UserName { get; set; }
        public string BearerToken { get; set; }
        public bool IsAuthenticated { get; set; }

        public UserAuth()
        {
            UserName = "Not authorized";
            BearerToken = string.Empty;
        }
    }
}
