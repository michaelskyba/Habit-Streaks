//This shouldn't be here if we switch back to master, right?

{ //Keeps track of which tab is open
chrome.storage.sync.get('last_active_tab', function(habit_streaks) //Opens the correct tab when you open extension
{
    if (habit_streaks.last_active_tab == undefined) //If you are opening extension for the first time, sets default
    {
        chrome.storage.sync.set({"last_active_tab": "about"})
        document.getElementById("about").style.color = "#04a12b";
        document.getElementById("about").style.fontWeight = "bold";
        document.getElementById("about").style.textDecoration = "underline";
        document.getElementById("about_div").style.display = "block";
    }
    else 
    {
        document.getElementById(habit_streaks.last_active_tab).style.color = "#04a12b";
        document.getElementById(habit_streaks.last_active_tab).style.fontWeight = "bold";
        document.getElementById(habit_streaks.last_active_tab).style.textDecoration = "underline";
        document.getElementById(habit_streaks.last_active_tab+"_div").style.display = "block";

        //calls whichever tab
        switch(habit_streaks.last_active_tab)
        {
            default:
                good_habits_tab();
        }
    }

})

document.getElementById("about").onclick = function() //If the ABOUT button is clicked
{
    chrome.storage.sync.get('last_active_tab', function(habit_streaks)
    {
        if (habit_streaks.last_active_tab != "about")
        {
            document.getElementById(habit_streaks.last_active_tab).style.color = "#000";
            document.getElementById(habit_streaks.last_active_tab).style.fontWeight = "normal";
            document.getElementById(habit_streaks.last_active_tab).style.textDecoration = "none";

            document.getElementById(habit_streaks.last_active_tab+"_div").style.display = "none";

            chrome.storage.sync.set({'last_active_tab': 'about'})

            document.getElementById("about_div").style.display = "block";

            document.getElementById("about").style.color = "#04a12b";
            document.getElementById("about").style.fontWeight = "bold";
            document.getElementById("about").style.textDecoration = "underline";
        }
    })
}
document.getElementById("good_habits").onclick = function() //If the GOOD HABITS button is clicked
{
    chrome.storage.sync.get('last_active_tab', function(habit_streaks)
    {
        if (habit_streaks.last_active_tab != "good_habits")
        {
            document.getElementById(habit_streaks.last_active_tab).style.color = "#000";
            document.getElementById(habit_streaks.last_active_tab).style.fontWeight = "normal";
            document.getElementById(habit_streaks.last_active_tab).style.textDecoration = "none";

            document.getElementById(habit_streaks.last_active_tab+"_div").style.display = "none";

            chrome.storage.sync.set({'last_active_tab': 'good_habits'})

            document.getElementById("good_habits_div").style.display = "block";

            document.getElementById("good_habits").style.color = "#04a12b";
            document.getElementById("good_habits").style.fontWeight = "bold";
            document.getElementById("good_habits").style.textDecoration = "underline";

            //Tells the good habit code area that it has been clicked
            good_habits_tab();
        }
    })
}
document.getElementById("bad_habits").onclick = function() //If the BAD HABITS button is clicked
{
    chrome.storage.sync.get('last_active_tab', function(habit_streaks)
    {
        if (habit_streaks.last_active_tab != "bad_habits")
        {
            document.getElementById(habit_streaks.last_active_tab).style.color = "#000";
            document.getElementById(habit_streaks.last_active_tab).style.fontWeight = "normal";
            document.getElementById(habit_streaks.last_active_tab).style.textDecoration = "none";

            document.getElementById(habit_streaks.last_active_tab+"_div").style.display = "none";

            chrome.storage.sync.set({'last_active_tab': 'bad_habits'})

            document.getElementById("bad_habits_div").style.display = "block";

            document.getElementById("bad_habits").style.color = "#04a12b";
            document.getElementById("bad_habits").style.fontWeight = "bold";
            document.getElementById("bad_habits").style.textDecoration = "underline";
        }
    })
}
document.getElementById("settings").onclick = function() //If the SETTINGS button is clicked
{
    chrome.storage.sync.get('last_active_tab', function(habit_streaks)
    {
        if (habit_streaks.last_active_tab != "settings")
        {
            document.getElementById(habit_streaks.last_active_tab).style.color = "#000";
            document.getElementById(habit_streaks.last_active_tab).style.fontWeight = "normal";
            document.getElementById(habit_streaks.last_active_tab).style.textDecoration = "none";

            document.getElementById(habit_streaks.last_active_tab+"_div").style.display = "none";

            chrome.storage.sync.set({'last_active_tab': 'settings'})

            document.getElementById("settings_div").style.display = "block";

            document.getElementById("settings").style.color = "#04a12b";
            document.getElementById("settings").style.fontWeight = "bold";
            document.getElementById("settings").style.textDecoration = "underline";
        }
    })
}
}

//Good habits tab
{

function good_clear(ID) //Clears the page for a new popup
{
    let good_habits = document.getElementsByClassName("good_habit");
    while (good_habits[0])
    {
        good_habits[0].remove();
    }
    
    document.getElementById("tabs").style.display = "none"; 
    document.getElementById("good_habits_div").style.display = "none";
    document.getElementById(ID).style.display = "block";
}

document.getElementById("task_list_button").onclick = function() //MAKE THIS WORK PROPERLY MAKE THIS WORK PROPERLY MAKE THIS WORK PROPERLY MAKE THIS WORK PROPERLY MAKE THIS WORK PROPERLY MAKE THIS WORK PROPERLY MAKE THIS WORK PROPERLY MAKE THIS WORK PROPERLY MAKE THIS WORK PROPERLY 
{
    good_habits_scroll = document.documentElement.scrollTop; //records the pos of scroll bar
    
    good_clear("task_list")

    document.getElementById("task_list_cancel").onclick = function()
    {
        //closes popup
        document.getElementById("tabs").style.display = "block";
        document.getElementById("good_habits_div").style.display = "block";
        document.getElementById("task_list").style.display = "none";
        good_habits_tab();

        //puts the scroll bar back in the correct pos
        setTimeout(function(){document.documentElement.scrollTop = good_habits_scroll}, 1);
    }

    //Displays habits
    chrome.storage.sync.get("task_list_sort", function(habit_streaks)
    {
        let local_sort;
        if (habit_streaks.task_list_sort == undefined) 
        {
            chrome.storage.sync.set({"task_list_sort": "urgency"})
            local_sort = "urgency";
        }
        else
        {
            document.getElementById("task_list_sort_select").value = habit_streaks.task_list_sort;
            local_sort = habit_streaks.task_list_sort;
        }

        switch(local_sort)
        {
            default:
                for (let i = 0; i < habit_streaks.good_habits.length; i++)
                {
                    generate_task(habit_streaks.good_habits[good_habits_difficulty_sort[i]])
                }
                break;
        }
    })

    document.getElementById("task_list_sort_select").onchange = function()
    {
        chrome.storage.sync.set
    }
}

function generate_task(habit)

//Corrects the Difficulty ranks
let good_habits_difficulty_sort = [];
function sort_good_habits_difficulty()
{
    chrome.storage.sync.get("good_habits", function(habit_streaks)
    {
        //Makes an easier way to work with the difficulty of each habit
        let entries = []
        for (let i = 0; i < habit_streaks.good_habits.length; i++)
        {
            let ch = habit_streaks.good_habits[i];
            let d;

            if (ch.times_completed == 0 && ch.times_failed == 0) d = 0;
            else d = 100-Math.floor(100*(parseInt(ch.times_completed)/(parseInt(ch.times_completed) + parseInt(ch.times_failed))))

            entries.push({"ID": i, "dif": d})
        }

        //Sorting algorithm (merge sort) using entries[i].dif
        function merge(arra, arrb)
        {
            let arrc = []

            while (arra.length > 0 && arrb.length > 0)
            {
                if (arra[0].dif > arrb[0].dif)
                {
                    arrc.push(arrb[0])
                    arrb.shift()
                }
                else
                {
                    arrc.push(arra[0])
                    arra.shift();
                }
            }

            while (arra.length > 0)
            {
                arrc.push(arra[0])
                arra.shift()
            }

            while (arrb.length > 0)
            {
                arrc.push(arrb[0])
                arrb.shift()
            }

            return arrc
        }

        function merge_sort(arr)
        {
            if (arr.length < 2) return arr

            let arr1 = arr.slice(0, Math.floor(arr.length/2))
            let arr2 = arr.slice(arr1.length, arr.length)

            arr1 = merge_sort(arr1)
            arr2 = merge_sort(arr2)

            let af = merge(arr1, arr2)
            return af
        }

        entries = merge_sort(entries)
    
        //Takes out the difficulties to create one list of IDs
        let final = []
        for (let i = 0; i < entries.length; i++)
        {
            final.push(entries[i].ID)
        }

        good_habits_difficulty_sort = final;
    })
}

//When the user selects a new option from the "Sort habits by" dropdown, change it in chrome storage
document.getElementById("good_habits_sort_select").onchange = function()
{
    chrome.storage.sync.set({"good_habits_sort": document.getElementById("good_habits_sort_select").value});
    let sscrollY = document.documentElement.scrollTop;
    good_habits_tab();
    setTimeout(function(){document.documentElement.scrollTop = sscrollY}, 1);
}

chrome.storage.sync.get('good_habits', function(habit_streaks)
{
    //Makes good_habits not undefined at start
    if (habit_streaks.good_habits == undefined) chrome.storage.sync.set({"good_habits": []})
})

//For when the user clicks settings on one of the habits
let good_habits_scroll;
function good_habit_settings(id) 
{
    //Records the pos of scroll bar
    good_habits_scroll = document.documentElement.scrollTop;

    chrome.storage.sync.get('good_habits', function(habit_streaks)
    {
        //Clear screen/setup
        good_clear("good_habits_settings");

        //Sets the inputs to be correct
        {
        document.getElementById("good_habit_settings_name_input").value = habit_streaks.good_habits[id].name;
        document.getElementById("good_habit_settings_description_input").value = habit_streaks.good_habits[id].description;
        }

        //Updates the characters remaining thing
        {
        document.getElementById("good_habit_settings_name_characters").innerHTML = (20-document.getElementById("good_habit_settings_name_input").value.length).toString();
        document.getElementById("good_habit_settings_description_characters").innerHTML = (50-document.getElementById("good_habit_settings_description_input").value.length).toString();
        document.getElementById("good_habit_settings_name_input").onkeyup = function()
        {
            document.getElementById("good_habit_settings_name_characters").innerHTML = (20-document.getElementById("good_habit_settings_name_input").value.length).toString();
        }
        document.getElementById("good_habit_settings_description_input").onkeyup = function()
        {
            document.getElementById("good_habit_settings_description_characters").innerHTML = (50-document.getElementById("good_habit_settings_description_input").value.length).toString();
        }
        }

        //when you click the X in the corner
        document.getElementById("good_habit_settings_cancel").onclick = function() 
        {
            //closes popup
            document.getElementById("tabs").style.display = "block";
            document.getElementById("good_habits_div").style.display = "block";
            document.getElementById("good_habits_settings").style.display = "none";
            good_habits_tab();

            //puts the scroll bar back in the correct pos
            setTimeout(function(){document.documentElement.scrollTop = good_habits_scroll}, 1);
        }

        //When you click save
        document.getElementById("good_habit_settings_submit").onclick = function(){good_habit_submit("settings_", id)}

        //When you click delete
        document.getElementById("good_habit_settings_delete").onclick = function()
        {
            //Makes sure you don't accidentally delete it
            if (confirm("Are you sure you want to delete this habit?"))
            {
                //Deletes the habit
                let x = habit_streaks.good_habits;
                x.splice(id, id+1)
                chrome.storage.sync.set({"good_habits": x});

                //Refreshes the page
                document.getElementById("tabs").style.display = "block";
                document.getElementById("good_habits_div").style.display = "block";
                document.getElementById("good_habits_settings").style.display = "none";
                good_habits_tab();
            }
        }

        //Brings up the custom date menu when you select "custom"
        {
        document.getElementById("good_habit_settings_complete_select").onchange = function()
        {
            if (document.getElementById("good_habit_settings_complete_select").value == "custom")
            {
                //do it
            }
        }
        }
    
    })
}
 
//When you enter the Good Habits tab
function good_habits_tab()
{
    //Removes all current ones from the page
    let good_habits = document.getElementsByClassName("good_habit");
    while (good_habits[0])
    {
        good_habits[0].remove();
    }

    sort_good_habits_difficulty();

    chrome.storage.sync.get(['good_habits', 'good_habits_sort'], function(habit_streaks)
    {
        //Sets the "Sort habits by" dropdown to the correct thing. If it's your first time, set's it to default
        if (habit_streaks.good_habits_sort == undefined) chrome.storage.sync.set({"good_habits_sort": "N-O"})
        else document.getElementById("good_habits_sort_select").value = habit_streaks.good_habits_sort;
        
        //So that if you delete your 1 habit it will still show the text
        document.getElementById("no_good_habits").style.display = "block";
        document.getElementById("task_list_button").style.display = "none";

        if (habit_streaks.good_habits.length > 0)
        {
            //Hides the "no habits" text
            document.getElementById("no_good_habits").style.display = "none";
            document.getElementById("task_list_button").style.display = "block";
            switch(habit_streaks.good_habits_sort)
            {
                case "O-N":
                    for (let i = 0; i < habit_streaks.good_habits.length; i++)
                    {
                        let ch = habit_streaks.good_habits[i];
                        let cp;
                        if (ch.times_completed == 0 && ch.times_failed == 0) cp = "not enough data"
                        else cp = 100-Math.floor(100*(parseInt(ch.times_completed)/(parseInt(ch.times_completed) + parseInt(ch.times_failed))))
                        generate_good_habit(i, ch.name, ch.description, ch.completion_schedule, ch.creation_date, ch.done_today, cp, ch.streaks, ch.best_streak, ch.current_streak, good_habits_difficulty_sort.indexOf(i)+1);
                    }
                    break;
                
                case "N-O":
                    for (let i = habit_streaks.good_habits.length-1; i > -1; i--)
                    {
                        let ch = habit_streaks.good_habits[i];
                        let cp;
                        if (ch.times_completed == 0 && ch.times_failed == 0) cp = "not enough data"
                        else cp = 100-Math.floor(100*(parseInt(ch.times_completed)/(parseInt(ch.times_completed) + parseInt(ch.times_failed))))
                        generate_good_habit(i, ch.name, ch.description, ch.completion_schedule, ch.creation_date, ch.done_today, cp, ch.streaks, ch.best_streak, ch.current_streak, good_habits_difficulty_sort.indexOf(i)+1);
                    }
                    break;

                case "E-H":
                    for (let i = 0; i < habit_streaks.good_habits.length; i++)
                    {
                        let ch = habit_streaks.good_habits[good_habits_difficulty_sort[i]];
                        let cp;
                        if (ch.times_completed == 0 && ch.times_failed == 0) cp = "not enough data"
                        else cp = 100-Math.floor(100*(parseInt(ch.times_completed)/(parseInt(ch.times_completed) + parseInt(ch.times_failed))))
                        generate_good_habit(good_habits_difficulty_sort[i], ch.name, ch.description, ch.completion_schedule, ch.creation_date, ch.done_today, cp, ch.streaks, ch.best_streak, ch.current_streak, good_habits_difficulty_sort.length-i);
                    }
                    break;

                case "H-E":
                    for (let i = habit_streaks.good_habits.length-1; i > -1; i--)
                    {
                        let ch = habit_streaks.good_habits[good_habits_difficulty_sort[i]];
                        let cp;
                        if (ch.times_completed == 0 && ch.times_failed == 0) cp = "not enough data"
                        else cp = 100-Math.floor(100*(parseInt(ch.times_completed)/(parseInt(ch.times_completed) + parseInt(ch.times_failed))))
                        generate_good_habit(good_habits_difficulty_sort[i], ch.name, ch.description, ch.completion_schedule, ch.creation_date, ch.done_today, cp, ch.streaks, ch.best_streak, ch.current_streak, good_habits_difficulty_sort.length-i);
                    }
                    break;
            }
        }
    })
}

function update_good_habit_stats(ID)
{
    /*
    Remake how good_habits are stored
    instead of storing completion fails and completion success
    store completion objects
    like
    let date1  and date2 (dates are strings) = <month textlimit=3>+" "+<num of day of month (always 2 digits)+" "+<year>+" "+<time>
    date1 is the starting point and date2 is ending point
    so if it's feb 6th and you have to do the habit every day,
    date1 would be "Feb 06 2020 00:00" and date2 would be "Feb 06 2020 23:59" //finish this
    habit_streaks.good_habits[i].completion = [{"date": [date1, date2], "completed": <boolean>}, {etc}]
    then this function will use habit_streaks.good_habits[ID].completion[i].completed and an algorithm 
    to update the "best streak" "average streak" "current streak" stuff
    */

}

//Used to load habits onto the Good Habits dashboard
function generate_good_habit(ID, name, description, completion_schedule, creation_date, done_today, difficulty, streaks, best_streak, current_streak, difficulty_rank)
{
    let habit = document.createElement("div");
    habit.className = "good_habit"
    habit.style = "margin: auto; margin-top: 15px; margin-bottom: 5px; text-align: center; width: 430px; height: 215px; border-style: solid; border-color: black; border-width: 1.5px; background-color: #f8f8f8;";

    let title = document.createElement("p");
    title.style = "float: none; clear: left; font-size: 18px; font-weight: bold; margin-top: 20px; margin-bottom: 0;"
    title.innerHTML = name;

    let about = document.createElement("p");
    about.style="font-size: 12px; margin-top: 0;"
    about.innerHTML = description;

    let date_started = document.createElement("p");
    date_started.style = "margin-top: 2px; margin-left: 5px; margin-bottom: 0; float: left; font-size: 13px;";
    date_started.innerHTML = "Started on\n"+creation_date;

    let settings_button = document.createElement("input");
    settings_button.type = "button";
    settings_button.value = "Settings"
    settings_button.style = "text-align: center; width: 75px; height: 18px; float: right; margin-top: 2px; margin-right: 5px; margin-bottom: 0;";
    settings_button.onclick = function(){good_habit_settings(ID);}

    let completion_button = document.createElement("input");
    completion_button.type = "button";
    completion_button.value = "I completed this habit (to be completed every: "+completion_schedule+").";
    completion_button.style = "width: 330px; height: 30px;";
    completion_button.onclick = function()
    {
        chrome.storage.sync.get('good_habits', function(habit_streaks)
        {
            let scrollY = document.documentElement.scrollTop;
            let hab = habit_streaks.good_habits;
            let gh = habit_streaks.good_habits[ID];

            gh.done_today = true;
            gh.streaks[habit_streaks.good_habits[ID].streaks.length-1]+=1
            gh.times_completed += 1;
            gh.current_streak+=1;
            if (gh.current_streak > gh.best_streak) gh.best_streak = gh.current_streak;

            hab[ID] = gh;
            chrome.storage.sync.set({"good_habits": hab});

            good_habits_tab();

            setTimeout(function(){document.documentElement.scrollTop = scrollY}, 1);
        });
    }

    document.getElementById("good_habits_settings").style.display = "none";

    let completion_text = document.createElement("p");
    completion_text.style = "white-space: pre-line;"
    completion_text.innerHTML = "You have completed this habit for now.\nIf you misclicked, visit the Habit settings to undo."

    let difficulty_ranking_text = document.createElement("p"); //This isn't actual difficulty rank
    difficulty_ranking_text.style = "display: inline-block; margin-right: 30px;"
    difficulty_ranking_text.innerHTML = "Difficulty rank: #"+ difficulty_rank;

    let difficulty_text = document.createElement("p");
    difficulty_text.style = "display: inline-block; margin-left: 30px;"
    difficulty_text.innerHTML = "Difficulty /100: "+difficulty

    let average_streak_text = document.createElement("p")
    average_streak_text.style="margin-right: 25px; margin-top: 1px; display: inline-block;"
    let average = streaks.reduce(function(a, b){return a+b})/streaks.length
    if (average % 1 == 0) average_streak_text.innerHTML = "Average streak: "+(average)
    else average_streak_text.innerHTML = "Average streak: "+Math.floor(average)+" to "+(Math.floor(average)+1);

    let best_streak_text = document.createElement("p");
    best_streak_text.innerHTML = "Your best streak: "+best_streak;
    best_streak_text.style = "margin-left: 25px; display: inline-block; margin-top: 1px;"
    
    let current_streak_text = document.createElement("p");
    current_streak_text.innerHTML = "Current streak: "+current_streak;

    habit.appendChild(settings_button);
    habit.appendChild(date_started)
    habit.appendChild(title);
    habit.appendChild(about);
    if (done_today) habit.appendChild(completion_text);
    else habit.appendChild(completion_button);
    habit.appendChild(difficulty_ranking_text);
    habit.appendChild(difficulty_text);
    habit.appendChild(document.createElement("br"))
    habit.appendChild(average_streak_text);
    habit.appendChild(best_streak_text);
    habit.appendChild(current_streak_text);
    document.getElementById("good_habits_div").appendChild(habit);
}

//New Habit Page
{

//when you click the "New Habit" button
document.getElementById("new_good_habit_button").onclick = function()
{
    //Hides everything to make the new habit popup
    document.getElementById("tabs").style.display = "none"; 
    document.getElementById("good_habits_div").style.display = "none";
    document.getElementById("new_good_habit_popup").style.display = "block";

    //Sets everything to default (in case you go on and leave and come back)
    document.body.style.setProperty('--good_habit_name_input_placeholder', 'grey')
    document.body.style.setProperty('--good_habit_description_input_placeholder', 'grey')

    document.getElementById("good_habit_name_input").placeholder = "Habit name";
    document.getElementById("good_habit_description_input").placeholder = "Habit description";

    document.getElementById("good_habit_name_input").value = "";
    document.getElementById("good_habit_description_input").value = "";


    document.getElementById("good_habit_name_characters").innerHTML = "20";
    document.getElementById("good_habit_description_characters").innerHTML = "50";
}

//when you click the X in the new habit page
document.getElementById("new_good_habit_cancel").onclick = function() 
{
    //closes popup
    document.getElementById("tabs").style.display = "block";
    document.getElementById("good_habits_div").style.display = "block";
    document.getElementById("new_good_habit_popup").style.display = "none";
}

//when you click submit on any habit page
document.getElementById("new_good_habit_submit").onclick = function(){good_habit_submit("", "");}
function good_habit_submit(extra, id)
{
    let name = document.getElementById("good_habit_"+extra+"name_input");
    let description = document.getElementById("good_habit_"+extra+"description_input");

    //Resets everything first
    document.body.style.setProperty('--good_habit_'+extra+'name_input_placeholder', 'grey')
    document.body.style.setProperty('--good_habit_'+extra+'description_input_placeholder', 'grey')

    name.placeholder = "Habit name";
    description.placeholder = "Habit description";

    //Warns you if you leave something blank
    if (name.value.length == 0)
    {
        document.body.style.setProperty('--good_habit_'+extra+'name_input_placeholder', 'red');
        name.placeholder = "You can't leave this blank";
    }
    if (description.value.length == 0)
    {
        document.body.style.setProperty('--good_habit_'+extra+'description_input_placeholder', 'red');
        description.placeholder = "You can't leave this blank";
    }

    //If you submit correctly
    if (name.value.length != 0 && description.value.length != 0)
    {
        chrome.storage.sync.get('good_habits', function(habit_streaks)
        {
            if (extra == "")
            {
                let temp = {
                    "name": name.value,
                    "description": description.value,
                    "completion_schedule": "day",
                    "creation_date": new Date().toString().substr(4, 11),
                    "done_today": false,
                    "times_completed": 0,
                    "times_failed": 0,
                    "streaks": [0],
                    "best_streak": 0,
                    "current_streak": 0
                } 
                
                //if you already have at least 1 habit
                if (habit_streaks.good_habits != undefined)
                {
                    let x = habit_streaks.good_habits;
                    x.push(temp)
                    chrome.storage.sync.set({"good_habits": x})
                }
                //first time, sets it to an array
                else
                {
                    chrome.storage.sync.set({"good_habits": [temp]})
                }
                
                document.getElementById("no_good_habits").style.display = "none";

                //Closes the popup menu
                document.getElementById("tabs").style.display = "block";
                document.getElementById("good_habits_div").style.display = "block";
                document.getElementById("new_good_habit_popup").style.display = "none";
                document.getElementById("no_good_habits").style.display = "none";
                good_habits_tab();
            }
            else
            {
                //Updates it
                let x = habit_streaks.good_habits;
                x[id].name = name.value;
                x[id].description = description.value;
                chrome.storage.sync.set({"good_habits": x})

                document.getElementById("tabs").style.display = "block";
                document.getElementById("good_habits_div").style.display = "block";
                document.getElementById("good_habits_settings").style.display = "none";
                good_habits_tab();
            }
        });
    }
}

//Changes the "characters left" text when you change something in the input
{
document.getElementById("good_habit_name_input").onkeyup = function()
{
    document.getElementById("good_habit_name_characters").innerHTML = (20-document.getElementById("good_habit_name_input").value.length).toString();
}
document.getElementById("good_habit_description_input").onkeyup = function()
{
    document.getElementById("good_habit_description_characters").innerHTML = (50-document.getElementById("good_habit_description_input").value.length).toString();
}
}
}

}

