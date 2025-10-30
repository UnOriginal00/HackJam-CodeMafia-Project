using System;
using System.Collections.Generic;

namespace backend.Models.DTOs
{
    public class ChatMessageDto
    {
        public int MessageID { get; set; }
        public int GroupID { get; set; }
        public int UserID { get; set; }
        public string Name { get; set; }
        public string Surname { get; set; }
        public string MessageText { get; set; }
        public DateTime CreatedAt { get; set; }
    }

    public class PagedResult<T>
    {
        public List<T> Items { get; set; } = new List<T>();
        public int TotalCount { get; set; }
        public int Page { get; set; }
        public int PageSize { get; set; }
    }
}