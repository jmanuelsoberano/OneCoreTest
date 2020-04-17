using Microsoft.AspNetCore.Mvc;
using OneCoreTest.Domain;
using OneCoreTest.Service;
using System;

namespace OneCoreTest.WebApp.Controllers
{
    [Route("[controller]")]
    [ApiController]
    public class SecurityController : ControllerBase
    {
        private readonly ISecurityManager _securityManager;

        public SecurityController(
            JwtSettings settings,
            ISecurityManager securityManager
            )
        {
            _securityManager = securityManager ??
                throw new ArgumentNullException(nameof(securityManager));
        }

        [HttpPost("login")]
        public IActionResult Login([FromBody]User user)
        {
            IActionResult ret = null;
            UserAuth auth = new UserAuth();
            //SecurityManager mgr = new SecurityManager(_settings);

            auth = _securityManager.ValidateUser(user);
            if (auth.IsAuthenticated)
            {
                ret = StatusCode(200, auth);
            }
            else
            {
                ret = StatusCode(404, "Invalid User Name/Password.");
            }

            return ret;
        }

    }
}
