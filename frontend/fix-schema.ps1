// Fix script - removes problematic lines and adds clean Payment model
$content = Get-Content "prisma\schema.prisma" -Raw
# Remove null bytes
$content = $content -replace "`0", ""
# Write clean content
$content | Set-Content "prisma\schema.prisma" -NoNewline
