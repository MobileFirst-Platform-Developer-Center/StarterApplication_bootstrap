/**
* Copyright 2015 IBM Corp.
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/
 
var busy;

function wlCommonInit() {
	busy = new WL.BusyIndicator();
	$('#navToFeeds').bind('click', displayFeedsTab);
	$('#navToAbout').bind('click', displayAboutTab);
	$('#backButton').bind('click', displayFeedsTab);
	$('#refreshButton').bind('click', loadFeeds);
	
	loadFeeds();
	displayFeedsTab();
}

//***************************************************************
// loadFeeds
//***************************************************************
function loadFeeds() {
	busy.show();
	
	/*
     * The REST API works with all adapters and external resources, and is supported on the following hybrid environments: 
     * iOS, Android, Windows Phone 8, Windows 8. 
     * For BlackBerry 6/7/10, Mobile Web and Desktop Browser, see the "Invoking Adapter Procedures in Hybrid Applications" tutorial for MobileFirst Platform 6.3
     */ 
	var resourceRequest = new WLResourceRequest("/adapters/StarterApplicationAdapter/getEngadgetFeeds", WLResourceRequest.GET, 30000);
	resourceRequest.send().then(
			onGetFeedsSuccess,
			onGetFeedsFail
	);
}

function onGetFeedsSuccess(response) {
	displayItemsList(response.responseJSON.items);
	busy.hide();
}

function onGetFeedsFail(response) {
	displayFeedsTab();
	busy.hide();
	WL.SimpleDialog.show("Starter Application", "Service not available. Try again later.", 
		[{
			text : 'Reload',
			handler : WL.Client.reloadApp
		},
		{
			text: 'Close',
			handler : function() {}
		}]
	);
}

//***************************************************************
// displayItemsList
//***************************************************************
function displayItemsList(items) {		
	var list = $('#feed'),
		i,
		item,
		a,
		text;
	
	var getCurrentItem = function (item, li) {
		return function() {			
			displayFeed(item);
		};
	};
	// Remove previous items
	list.empty();
	
	for (i = 0; i < items.length; i += 1) {		
		item = items[i];
		a = $('<a/>').addClass("list-group-item").text(item.title);
		a.click(getCurrentItem(item, a));
		list.append(a);	
	}
}

//***************************************************************
// displayFeed
//***************************************************************
function displayFeed(feed) {
	$(document).scrollTop(0);
	var str = "";
	str += "<h2>"+ feed.title +"</h2>";
	str += "<div>"+ feed.pubDate.substring(0,22) +"</div>";
	str += "<p>"+ feed.description + "</p>";
	
	$('#item').empty();
	$('#item').html(str);

	// add target='_blank' attribute to all the links
    $('#item a').attr('target','_blank');
	
	$('#feed').hide(); // hide the feeds list
	$('#about').hide(); // hide the about
	$('#item').show(); // display the feed
	$('#refreshButton').hide();
	$('#backButton').show();
	WL.App.overrideBackButton (displayFeedsTab);
}

//***************************************************************
// displayFeedsTab
//***************************************************************
function displayFeedsTab(){
	$('#about').hide(); // hide the about
	$('#item').hide(); // hide the feed
	$('#feed').show(); // display the feeds list
	$('#backButton').hide();
	$('#refreshButton').show();
	$('#navToAbout').removeClass('active'); // deselect the about nav
	$('#navToFeeds').addClass('active'); // select the feed nav
	WL.App.resetBackButton();
}

//***************************************************************
// displayAboutTab
//***************************************************************
function displayAboutTab(){
	$(document).scrollTop(0);
	$('#feed').hide(); // hide the feeds list
	$('#item').hide(); // hide the feed
	$('#about').show(); // display the about
	$('#refreshButton').hide();
	$('#backButton').hide();
	$('#navToFeeds').removeClass('active'); // deselect the feed nav
	$('#navToAbout').addClass('active'); // select the about nav
}
