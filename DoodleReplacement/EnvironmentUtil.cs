using System;

namespace DoodleReplacement
{
	internal class EnvironmentUtil
	{
		public static string GetEnvironmentVariable(string name)
		{
			return Environment.GetEnvironmentVariable(name, EnvironmentVariableTarget.Process);
		}
	}
}
