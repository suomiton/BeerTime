using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Extensions.Http;
using Microsoft.Extensions.Logging;
using Microsoft.WindowsAzure.Storage.Table;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace DoodleReplacement
{
	public static class GetAnswerEntries
	{
		[FunctionName("GetAnswerEntries")]
		public static async Task<IActionResult> Run(
			[HttpTrigger(AuthorizationLevel.Function, "get", Route = null)] HttpRequest req,
			ILogger log)
		{
			try
			{
				var partition = req.Query["partition"];

				var service = new EntriesBL();
				var model = await service.GetAnswerEntriesForPartition(partition);

				return new OkObjectResult(model);
			}
			catch (Exception ex)
			{
				log.LogError(ex.Message, ex);
				return new BadRequestObjectResult(ex.Message);
			}
		}
	}
}
