$serviceKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZrYXZ4YWxkcnRyaGNwdGtna3hjIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1OTE1ODIwNywiZXhwIjoyMDc0NzM0MjA3fQ.-ggspdboVAkN8dinqrvoKN_cl_3GsRrYubO_R0dKY30"
$baseUrl = "https://vkavxaldrtrhcptkgkxc.supabase.co/rest/v1"

$headers = @{
    'apikey' = $serviceKey
    'Authorization' = "Bearer $serviceKey"
    'Content-Type' = 'application/json'
}

# Get all users except George Watkins
$users = Invoke-RestMethod -Uri "$baseUrl/users?select=id,username&username=neq.George%20Watkins" -Headers $headers

foreach ($user in $users) {
    $parts = $user.username -split '_'
    if ($parts.Count -eq 2) {
        $firstName = (Get-Culture).TextInfo.ToTitleCase($parts[0])
        $surname = (Get-Culture).TextInfo.ToTitleCase($parts[1])
        $newUsername = "$firstName $surname"

        $body = @{
            first_name = $firstName
            surname = $surname
            username = $newUsername
        } | ConvertTo-Json

        Write-Host "Updating $($user.username) -> $newUsername"

        Invoke-RestMethod -Method PATCH -Uri "$baseUrl/users?id=eq.$($user.id)" -Headers $headers -Body $body | Out-Null
    }
}

# Verify results
Write-Host "`nUpdated users:"
$result = Invoke-RestMethod -Uri "$baseUrl/users?select=id,username,first_name,surname&order=username" -Headers $headers
$result | Format-Table username, first_name, surname
