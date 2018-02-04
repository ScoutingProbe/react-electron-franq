$wshell = New-Object -ComObject wscript.shell
$wshell.Run('explorer "c:\riot games\league of legends\logs\leagueclient logs"', 8)
taskkill /im explorer.exe