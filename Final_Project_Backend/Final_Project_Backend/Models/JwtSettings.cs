namespace Final_Project_Backend.Models
{
    public class JwtSettings
    {
        public string Key { get; set; } = string.Empty;        // Corresponding to "Key" in appsettings.json
        public string Issuer { get; set; } = string.Empty;     // Corresponding to "Issuer" in appsettings.json
        public string Audience { get; set; } = string.Empty;   // Corresponding to "Audience" in appsettings.json
        public int ExpireMinutes { get; set; }                 // Corresponding to "ExpireMinutes" in appsettings.json
    }
}
