using Microsoft.IdentityModel.Tokens;
using OneCoreTest.Data;
using OneCoreTest.Domain;
using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Text;

namespace OneCoreTest.Service
{
    public class SecurityManager : ISecurityManager
    {
        public readonly OneCoreTestDbContext _context;

        private JwtSettings _settings = null;

        public SecurityManager(JwtSettings settings, OneCoreTestDbContext context)
        {
            _settings = settings;
            _context = context ?? throw new ArgumentException(nameof(context));
        }

        public UserAuth ValidateUser(User user)
        {
            UserAuth ret = new UserAuth();
            User authUser = null;


            authUser = _context.Users.Where(
                u => u.Name.ToLower() == user.Name.ToLower()
                && u.Password == user.Password).FirstOrDefault();

            if (authUser != null)
            {
                ret = BuildUserAuthObject(authUser);
            }

            return ret;
        }

        protected UserAuth BuildUserAuthObject(User authUser)
        {
            UserAuth ret = new UserAuth();

            ret.UserName = authUser.Name;
            ret.IsAuthenticated = true;

            // ret.Claims = GetUserClaims(authUser);

            ret.BearerToken = BuildJwtToken(ret);

            return ret;
        }

        //protected List<UserClaim> GetUserClaims(User authUser)
        //{
        //    List<UserClaim> list = new List<UserClaim>();

        //    try
        //    {
        //        using (var db = new JwtDbContext())
        //        {
        //            list = db.Claims.Where(
        //                u => u.UserId == authUser.UserId).ToList();
        //        }
        //    }
        //    catch (Exception ex)
        //    {
        //        throw new Exception(
        //            "Exception trying to retrieve user claims.", ex);
        //    }

        //    return list;
        //}

        protected string BuildJwtToken(UserAuth authUser)
        {
            SymmetricSecurityKey key = new SymmetricSecurityKey(
                Encoding.UTF8.GetBytes(_settings.Key));

            //List<Claim> jwtClaims = new List<Claim>();
            //jwtClaims.Add(new Claim(JwtRegisteredClaimNames.Sub,
            //    authUser.UserName));
            //jwtClaims.Add(new Claim(JwtRegisteredClaimNames.Jti,
            //    Guid.NewGuid().ToString()));

            //jwtClaims.Add(new Claim("isAuthenticated",
            //    authUser.IsAuthenticated.ToString().ToLower()));

            //foreach (var claim in authUser.Claims)
            //{
            //    jwtClaims.Add(new Claim(claim.ClaimType, claim.ClaimValue));
            //}

            var token = new JwtSecurityToken(
                issuer: _settings.Issuer,
                audience: _settings.Audience,
                //claims: jwtClaims,
                notBefore: DateTime.UtcNow,
                expires: DateTime.UtcNow.AddMinutes(
                    _settings.MinutesToExpiration),
                signingCredentials: new SigningCredentials(key,
                SecurityAlgorithms.HmacSha256)
                );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }
}
