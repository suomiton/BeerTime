using Microsoft.WindowsAzure.Storage.Table;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace DoodleReplacement
{
	class AnswerEntity : TableEntity
	{
		public string Name { get; set; }
		public string AdditionalMessage { get; set; }
		public string SelectedDatesString { get; set; }
		public AnswerEntity() {}
		public AnswerEntity(string key, string name)
		{
			PartitionKey = key;
			RowKey = name.Trim().Replace(" ", "").ToLower();
		}
	}

	class AnswerAM
	{
		public string Name { get; set; }
		public IEnumerable<DateTime> SelectedDates { get; set; }
		public string AdditionalMessage { get; set; }

		[JsonIgnore]
		public bool IsValid => !string.IsNullOrWhiteSpace(Name) && SelectedDates?.Any() == true;

		public static AnswerAM FromEntity(AnswerEntity entity)
		{
			return new AnswerAM
			{
				Name = entity.Name,
				SelectedDates = entity.SelectedDatesString?.Split(',').Select(d => DateTime.Parse(d)).ToList(),
				AdditionalMessage = entity.AdditionalMessage
			};
		}
	}
}
