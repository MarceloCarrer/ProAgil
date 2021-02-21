using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using ProAgil.Domain.Identity;
using ProAgil.WebAPI.Dtos;

namespace ProAgil.WebAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]

    public class UserController : ControllerBase
    {
        private readonly IConfiguration config;
        private readonly UserManager<User> userManager;
        private readonly SignInManager<User> signInManager;
        private readonly IMapper mapper;

        public UserController(IConfiguration config,
                              UserManager<User> userManager,
                              SignInManager<User> signInManager,
                              IMapper mapper)
        {
            this.config = config;
            this.userManager = userManager;
            this.signInManager = signInManager;
            this.mapper = mapper;
        }

        [HttpGet("GetUser")]
        public async Task<IActionResult> GetUser()
        {
            return Ok(new UserDto());
        }

        [HttpPost("Register")]
        [AllowAnonymous]
        public async Task<IActionResult> Register(UserDto userDto)
        {
            try
            {
                var user = this.mapper.Map<User>(userDto);
                var result = await this.userManager.CreateAsync(user, userDto.Password);
                var userToReturn = this.mapper.Map<UserDto>(user);

                if (result.Succeeded)
                {
                    return  Created("GetUser", userToReturn);
                }

                return BadRequest(result.Errors);
            }
            catch (System.Exception ex) 
            {                
                return this.StatusCode(StatusCodes.Status500InternalServerError, $"Falha Banco de Dados {ex.Message}");
            }
        }

        [HttpPost("Login")]
        [AllowAnonymous]
        public async Task<IActionResult> Login(UserLoginDto userLoginDto)
        {
            try
            {
                var user = await this.userManager.FindByNameAsync(userLoginDto.UserName);
                var result = await this.signInManager.CheckPasswordSignInAsync(user, userLoginDto.Password, false);

                if (result.Succeeded)
                {
                    var appUser = await this.userManager.Users
                        .FirstOrDefaultAsync(u => u.NormalizedUserName == userLoginDto.UserName.ToUpper());

                    var userToReturn = this.mapper.Map<UserLoginDto>(appUser);

                    return Ok(new {
                        token = GenerateJWToken(appUser).Result,
                        user = userToReturn
                    });
                };

                return Unauthorized();
            }
            catch (System.Exception ex)
            {                
                return this.StatusCode(StatusCodes.Status500InternalServerError, $"Falha Banco de Dados {ex.Message}");
            }
        }

        private async Task<string> GenerateJWToken(User user)
        {
            var claims = new List<Claim>
            {
                new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
                new Claim(ClaimTypes.Name, user.UserName)
            };

            var roles = await this.userManager.GetRolesAsync(user);

            foreach (var role in roles)
            {
                claims.Add(new Claim(ClaimTypes.Role, role));
            }

            var key = new SymmetricSecurityKey(Encoding.ASCII
                        .GetBytes(this.config.GetSection("AppSettings:Token").Value));

            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha512Signature);

            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(claims),
                Expires = DateTime.Now.AddDays(1),
                SigningCredentials = creds
            };

            var tokenHandler = new JwtSecurityTokenHandler();

            var token = tokenHandler.CreateToken(tokenDescriptor);

            return tokenHandler.WriteToken(token);
        }
    }
}