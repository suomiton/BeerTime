using Microsoft.WindowsAzure.Storage;
using Microsoft.WindowsAzure.Storage.Table;
using System.Threading.Tasks;

namespace DoodleReplacement
{
	internal class StorageService
	{
		public static async Task<CloudTable> GetStorageTableReference()
		{
			var storageAccount = CloudStorageAccount.Parse(EnvironmentUtil.GetEnvironmentVariable("StorageEndpoint"));
			var tableClient = storageAccount.CreateCloudTableClient();
			var table = tableClient.GetTableReference("DoodleAnswers");

			await table.CreateIfNotExistsAsync();

			return table;
		}
	}
}
