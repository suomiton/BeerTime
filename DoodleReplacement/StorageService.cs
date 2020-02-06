using Microsoft.WindowsAzure.Storage;
using Microsoft.WindowsAzure.Storage.Blob;
using Microsoft.WindowsAzure.Storage.Table;
using System.Threading.Tasks;

namespace DoodleReplacement
{
	internal class StorageService
	{
		public static async Task<CloudBlobContainer> GetStorageBlobReference() {
			var storageAccount = CloudStorageAccount.Parse(EnvironmentUtil.GetEnvironmentVariable("StorageEndpoint"));
			var blobClient = storageAccount.CreateCloudBlobClient();
			var container = blobClient.GetContainerReference("config");

			await container.CreateIfNotExistsAsync();

			return container;
		}

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
