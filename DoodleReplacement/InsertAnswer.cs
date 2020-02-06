using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Extensions.Http;
using Microsoft.Extensions.Logging;
using Microsoft.WindowsAzure.Storage.Table;
using Newtonsoft.Json;
using System;
using System.IO;
using System.Linq;
using System.Net.Http;
using System.Threading.Tasks;

namespace DoodleReplacement
{
	public static class InsertAnswer
	{
		[FunctionName("InsertAnswer")]
		public static async Task<IActionResult> Run(
			[HttpTrigger(AuthorizationLevel.Function, "post", Route = null)] HttpRequest req,
			ILogger log)
		{
			try
			{
				var partition = req.Query["partition"];

				var service = new EntriesBL();
				var config = await service.GetEntryConfig(partition);

				if(config == null) {
					return new BadRequestResult();
				}

				string requestBody = await new StreamReader(req.Body).ReadToEndAsync();
				var model = JsonConvert.DeserializeObject<AnswerAM>(requestBody);

				if(!model.IsValid)
				{
					return new BadRequestObjectResult("Model is invalid! Name or dates missing.");
				}

				var entity = new AnswerEntity(partition, model.Name)
				{
					Name = model.Name,
					AdditionalMessage = model.AdditionalMessage,
					SelectedDatesString = string.Join(',', model.SelectedDates.Select(sd => sd.ToString("yyyy-MM-dd")))
				};

				var table = await StorageService.GetStorageTableReference();

				await table.ExecuteAsync(TableOperation.Insert(entity));

				if(!string.IsNullOrEmpty(config.WebHookUrl)) {
					using (var client = new HttpClient()) {
						await client.PostAsync(config.WebHookUrl, null);
					}
				}

				return new OkObjectResult(entity);
			}
			catch(Exception ex)
			{
				log.LogError(ex.Message, ex);
				return new BadRequestObjectResult(ex.Message);
			}
		}
	}
}
