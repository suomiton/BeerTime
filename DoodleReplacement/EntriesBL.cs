using Microsoft.WindowsAzure.Storage.Table;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DoodleReplacement {
	internal sealed class EntriesBL {
		public async Task<Config> GetEntryConfig(string partition) {
			var container = await StorageService.GetStorageBlobReference();

			var blob = container.GetBlockBlobReference($"{partition}.json");
			
			if(!(await blob.ExistsAsync())) {
				throw new ArgumentException("Invalid request");
			}

			string result = await blob.DownloadTextAsync();
			return JsonConvert.DeserializeObject<Config>(result);
		}

		public async Task<IEnumerable<AnswerAM>> GetAnswerEntriesForPartition(string partition) {
			var table = await StorageService.GetStorageTableReference();

			TableContinuationToken token = null;
			var model = new List<AnswerAM>();
			var query = new TableQuery<AnswerEntity>().Where(
				TableQuery.GenerateFilterCondition(
					"PartitionKey", QueryComparisons.Equal, partition
				)
			);

			do {
				var queryResult = await table.ExecuteQuerySegmentedAsync(query, token);
				model.AddRange(queryResult.Results.Select(AnswerAM.FromEntity));
				token = queryResult.ContinuationToken;
			} while (token != null);

			return model;
		}

		public IEnumerable<DateScore> GetScoredResults(IEnumerable<AnswerAM> answers) {
			var totalResults = answers.Count();
			var dates = answers.SelectMany(r => r.SelectedDates);

			var scores = new List<DateScore>();

			foreach(var date in dates) {
				if(scores.Any(s => s.TimeStamp.Equals(date))) {
					continue;
				}
				scores.Add(CalculateScore(date));
			}

			return scores;

			DateScore CalculateScore(DateTime date) {
				var numberOfResults = answers.Count(r => r.SelectedDates.Any(d => d.Equals(date)));
				return new DateScore {
					Score = decimal.Divide(numberOfResults, totalResults),
					TimeStamp = date
				};
			}
		}

		public class DateScore {
			public DateTime TimeStamp { get; set; }
			public decimal Score { get; set; }
		}

		public class Config {
			public string Title { get; set; }
			public string WebHookUrl { get; set; }
		}
	}
}
