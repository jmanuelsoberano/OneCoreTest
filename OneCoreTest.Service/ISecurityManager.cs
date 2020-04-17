using OneCoreTest.Domain;

namespace OneCoreTest.Service
{
    public interface ISecurityManager
    {
        UserAuth ValidateUser(User user);
    }
}