using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using OneCoreTest.Domain;
using OneCoreTest.Service;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace OneCoreTest.WebApp.Controllers
{
    [ApiController]
    [Route("[controller]")]
    [Authorize]
    public class UsersController : ControllerBase
    {
        private readonly IOneCoreTestRepository _oneCoreTestRepository;

        public UsersController(IOneCoreTestRepository oneCoreTestRepository)
        {
            _oneCoreTestRepository = oneCoreTestRepository ??
                throw new ArgumentNullException(nameof(oneCoreTestRepository));
        }

        [HttpGet]
        public ActionResult<IEnumerable<User>> GetUsers()
        {
            var usersFromRepo = _oneCoreTestRepository.GetUsers();
            return Ok(usersFromRepo.ToList());
        }

        [HttpGet("{id}", Name = "GetUser")]
        public ActionResult<User> GetUser(Guid id)
        {
            var userFromRepo = _oneCoreTestRepository.GetUser(id);

            if (userFromRepo == null)
            {
                return NotFound();
            }

            return Ok(userFromRepo);
        }

        [HttpPost]
        public ActionResult<User> CreateUser(User user)
        {
            if (_oneCoreTestRepository.ExistingUser(user))
            {
                return BadRequest("Usuario/Correo duplicado");
            }

            _oneCoreTestRepository.AddUser(user);
            _oneCoreTestRepository.Save();

            return CreatedAtRoute("GetUser",
                new { id = user.Id }, user);
        }

        [HttpPut("{id}")]
        public IActionResult UpdateCourseForAuthor(Guid id, User user)
        {
            var userFromRepo = _oneCoreTestRepository.GetUser(id);

            if (userFromRepo == null)
            {
                user.Id = id;

                _oneCoreTestRepository.AddUser(user);

                _oneCoreTestRepository.Save();

                return CreatedAtRoute("GetUser",
                    new { id = user.Id },
                    user);
            }

            userFromRepo.Email = user.Email;
            userFromRepo.Name = user.Name;
            userFromRepo.Password = user.Password;
            userFromRepo.Status = user.Status;
            userFromRepo.Gender = user.Gender;

            _oneCoreTestRepository.UpdateUser(userFromRepo);

            _oneCoreTestRepository.Save();

            return NoContent();
        }

        [HttpDelete("{id}")]
        public ActionResult DeleteUser(Guid id)
        {
            var userFromRepo = _oneCoreTestRepository.GetUser(id);

            if (userFromRepo == null)
            {
                return NotFound();
            }

            userFromRepo.Status = false;

            _oneCoreTestRepository.DeleteUser(userFromRepo);
            _oneCoreTestRepository.Save();

            return NoContent();
        }

    }
}
