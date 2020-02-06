using System;
using System.IO;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Extensions.Http;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;

namespace DoodleReplacement
{
    public static class GetScoresForPartition
    {
        [FunctionName("GetScoresForPartition")]
        public static async Task<IActionResult> Run(
            [HttpTrigger(AuthorizationLevel.Function, "get", Route = null)] HttpRequest req,
            ILogger log)
        {
			try {
				var partition = req.Query["partition"];

				var service = new EntriesBL();
				var config = await service.GetEntryConfig(partition);

				if(config == null) {
					return new BadRequestResult();
				}

				var answers = await service.GetAnswerEntriesForPartition(partition);
				var scores = service.GetScoredResults(answers);

				return new OkObjectResult(new {
					config,
					scores,
					answers
				});
			}
			catch (Exception ex) {
				log.LogError(ex.Message, ex);
				return new BadRequestObjectResult(ex.Message);
			}
		}
    }
}
