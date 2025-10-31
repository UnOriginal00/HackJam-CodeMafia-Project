using System;
using System.IO;
using System.Text.Json;
using System.Threading.Tasks;
using Microsoft.Extensions.Configuration;

namespace backend.Services
{
    public class AIService
    {
        private readonly string _ragFolder;

        public AIService(IConfiguration config)
        {
            // configure where incoming notes are stored (set in appsettings or fallback)
            _ragFolder = config["Ai:RagFolder"] ?? Path.Combine(AppContext.BaseDirectory, "RAG_Responses");
            Directory.CreateDirectory(_ragFolder);
        }

        // Save incoming NoteDto (as JSON file) and return file path
        public async Task<string> SaveNoteAsync(object note)
        {
            var filename = $"note_{DateTime.UtcNow:yyyyMMddHHmmssfff}.json";
            var path = Path.Combine(_ragFolder, filename);
            var json = JsonSerializer.Serialize(note, new JsonSerializerOptions { WriteIndented = true });
            await File.WriteAllTextAsync(path, json);
            return path;
        }
    }
}
