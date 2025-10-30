using backend.Data;
using backend.Models;
using Microsoft.EntityFrameworkCore;

namespace backend.Services
{
    public class GroupActionsService
    {
        private readonly HackJamDbContext _context;

        public GroupActionsService(HackJamDbContext context) 
        {
            _context = context;
        }

        //Create Group
        /*public async Task<Group_List> createGroupAsync(Group_List group) 
        {
            if (group == null) {

                // Check if group already exists, if it does then dont create group for user but if it does not exist create group

                Group_List userGroup = new Group_List();

                return userGroup;
       
            }

        }*/





    }
}
