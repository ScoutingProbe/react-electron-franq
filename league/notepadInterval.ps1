param([string]$location = "E:\Riot Games\League of Legends\Logs\LeagueClient Logs\2018-03-15T08-41-22_2028_LeagueClient.log")
start-process -filepath $location -windowstyle minimized
taskkill /im notepad.exe