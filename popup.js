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

/*
Difficult questions

What should I do first?
I know I first want to make done_today false once it's a new day

When should I check?
I should check when the habits are about to be displayed anywhere
i.e. good_habits_tab() and task_list()

How do I check?
I can keep track of the date that the habit should be completed by in chrome storage
Then, I can compare the current date with the completion date

Where should I check?
In good_habits_tab(), right before the difficulty sort
because the difficulty sort won't be accurate otherwise

Implement the above and work from there

Using a background script to track time will not work
Because the program would break if things were supposed to happen when they were offline
and it would be laggy
*/

//Good habits tab
{

//Main good habits tab
{

//When the user selects a new option from the "Sort habits by" dropdown, change it in chrome storage
document.getElementById("good_habits_sort_select").onchange = function()
{
    chrome.storage.sync.set({"good_habits_sort": document.getElementById("good_habits_sort_select").value});
    let sscrollY = document.documentElement.scrollTop;
    good_habits_tab();
    setTimeout(function(){document.documentElement.scrollTop = sscrollY}, 1);
}

function habit_completed(ID)
{
    chrome.storage.sync.get('good_habits', function(habit_streaks)
    {   
        //Makes things easier to work with
        let hab = habit_streaks.good_habits;
        let gh = habit_streaks.good_habits[ID];

        //Updates the data to true
        gh.done_today = true;
        gh.completions.push({"date": [new Date().toString().substr(4, 11)+" 00:00", new Date().toString().substr(4, 11)+" 23:59"], "completed": true})
        hab[ID] = gh;
        chrome.storage.sync.set({"good_habits": hab});

        //Updates all the other habit stats like best streak, average streak etc.
        update_good_habit_stats(ID);
    });
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

    //
    //Update the times now
    update_good_habits_time();

    //Sorts everything before starting
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
                        generate_good_habit(i, ch.name, ch.description, ch.creation_date, ch.done_today, ch.difficulty, ch.average_streak, ch.best_streak, ch.current_streak, good_habits_difficulty_sort.indexOf(i)+1);
                    }
                    break;
                
                case "N-O":
                    for (let i = habit_streaks.good_habits.length-1; i > -1; i--)
                    {
                        let ch = habit_streaks.good_habits[i];
                        generate_good_habit(i, ch.name, ch.description, ch.creation_date, ch.done_today, ch.difficulty, ch.average_streak, ch.best_streak, ch.current_streak, good_habits_difficulty_sort.indexOf(i)+1);
                    }
                    break;

                case "E-H":
                    for (let i = 0; i < habit_streaks.good_habits.length; i++)
                    {
                        let ch = habit_streaks.good_habits[good_habits_difficulty_sort[i]];
                        generate_good_habit(good_habits_difficulty_sort[i], ch.name, ch.description, ch.creation_date, ch.done_today, ch.difficulty, ch.average_streak, ch.best_streak, ch.current_streak, good_habits_difficulty_sort.length-i);
                    }
                    break;

                case "H-E":
                    for (let i = habit_streaks.good_habits.length-1; i > -1; i--)
                    {
                        let ch = habit_streaks.good_habits[good_habits_difficulty_sort[i]];
                        generate_good_habit(good_habits_difficulty_sort[i], ch.name, ch.description, ch.creation_date, ch.done_today, ch.difficulty, ch.average_streak, ch.best_streak, ch.current_streak, good_habits_difficulty_sort.length-i);
                    }
                    break;
            }
        }
    })
}

//Used to load habits onto the Good Habits dashboard
function generate_good_habit(ID, name, description, creation_date, done_today, difficulty, average_streak, best_streak, current_streak, difficulty_rank)
{
    let habit = document.createElement("div");
    habit.className = "good_habit"
    habit.style = "margin: auto; margin-top: 15px; margin-bottom: 5px; text-align: center; width: 430px; height: 200px; border-style: solid; border-color: black; border-width: 1.5px; background-color: #f8f8f8;";

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
    completion_button.value = "I completed this habit.";
    completion_button.style = "width: 150px; height: 25px; margin-bottom: 10px;";
    completion_button.onclick = function()
    {
        //Records the position of scroll bar before clicking the button
        let scrollY = document.documentElement.scrollTop;

        //Updates stats
        habit_completed(ID)
        
        //Resets the page to include new info
        setTimeout(function(){good_habits_tab()}, 10);

        //Puts the page back into the original position so it looks like the page wasn't reset
        setTimeout(function(){document.documentElement.scrollTop = scrollY}, 20);
        
    }

    document.getElementById("good_habits_settings").style.display = "none";

    let completion_text = document.createElement("p");
    completion_text.style = "white-space: pre-line; margin-bottom: 8px;"
    completion_text.innerHTML = "You have completed this habit for now.\nIf you misclicked, visit the Habit settings to undo."

    let difficulty_ranking_text = document.createElement("p"); //This isn't actual difficulty rank
    difficulty_ranking_text.style = "display: inline-block; margin-right: 30px;"
    difficulty_ranking_text.innerHTML = "Difficulty rank: #"+ difficulty_rank;

    let difficulty_text = document.createElement("p");
    difficulty_text.style = "display: inline-block; margin-left: 30px;"
    difficulty_text.innerHTML = "Difficulty /100: "+difficulty

    let average_streak_text = document.createElement("p")
    average_streak_text.style="margin-right: 25px; margin-top: 1px; display: inline-block;"
    if (average_streak % 1 == 0) average_streak_text.innerHTML = "Average streak: "+(average_streak)
    else average_streak_text.innerHTML = "Average streak: "+Math.floor(average_streak)+" to "+(Math.floor(average_streak)+1);

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
    else 
    {
        habit.appendChild(completion_button);
        habit.appendChild(document.createElement("br"))
    }
    
    habit.appendChild(difficulty_ranking_text);
    habit.appendChild(difficulty_text);
    habit.appendChild(document.createElement("br"))
    habit.appendChild(average_streak_text);
    habit.appendChild(best_streak_text);
    habit.appendChild(current_streak_text);
    document.getElementById("good_habits_div").appendChild(habit);
}
}

//Settings
{

//Completion History
{
function completion_history()
{

}

function dim_history(boolean)
{
    if (boolean) document.getElementById("completion_history").src = "history_hover.png"
    else document.getElementById("completion_history").src = "history.png"
}

document.getElementById("completion_history").onmouseover = dim_history(true)
document.getElementById("completion_history").onmouseout = dim_history(false)
}

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
}

//General
{

function update_good_habits_time() //NOT TESTED
{
    /*
    How this function will work: 
    retrieve good_habits from storage
    
    for habit in good_habits:
        while completion date has passed:
            if done_today:
                set done_today to false
            else:
                throw the instance to the late array
                push it as failed in the completions array
        change the completion date to +1 day
    */

    chrome.storage.sync.get(["good_habits", "late"], function(habit_streaks)
    {
        //Easier to update chrome storage
        let habits = habit_streaks.good_habits;

        //updates EVERY habit
        for (let i = 0; i < habits.length; i++)
        {
            //Less typing
            let habit = habits[i];

            //for multiple late days
            while (date_greater_than(new Date().toString().substr(4, 17), habit.completion_date))
            {
                let late = habit_streaks.late;

                if (habit.done_today) habit.done_today = false;
                else
                {
                    //Sets this instance to late
                    late.push([habit.completion.date.substr(0, 12)+"00:00", habit.completion_date])

                    //Sets this day to 'failed'
                    habit.completions.push({"date": [habit.completion.date.substr(0, 12)+"00:00", habit.completion_date], "completed": false})
                }

                //Changes the completion date to +1 day
                let real = new Date(habit.completion_date)
                real.setDate(real.getDate()+1)
                habit.completion_date = real.toString().substr(4, 17);

                //Updates data
                habits[i] = habit;
                chrome.storage.sync.set({"late": late, "good_habits": habits})
            }
        }
    })
}

//mainly for checking if current date is past date x
function date_greater_than (date1, date2)
{
    //Dates should be in the format Month(maxlength=3) Day(num minlength=2), Year hour(minlength=2):minute(minlength=2)(24h time)
    //Eg Apr 03 2020 23:59
    //the function caller is asking "is date1 greater than date2?" and gets a boolean in return

    let months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]

    //Compares the years
    if (parseInt(date1.substr(7, 4)) > parseInt(date2.substr(7, 4))) return true
    else if (parseInt(date1.substr(7, 4)) < parseInt(date2.substr(7, 4))) return false
    else //the elses are for if both values are the same
    {
        //Compares the months
        if (months.indexOf(date1.substr(0, 3)) > months.indexOf(date2.substr(0, 3))) return true
        else if (months.indexOf(date1.substr(0, 3)) < months.indexOf(date2.substr(0, 3))) return false
        else
        {
            //Compares the days
            if (parseInt(date1.substr(4, 2)) > parseInt(date2.substr(4, 2))) return true
            if (parseInt(date1.substr(4, 2)) < parseInt(date2.substr(4, 2))) return false
            else
            {
                //Compares the hours
                if (parseInt(date1.substr(12, 2)) > parseInt(date2.substr(12, 2))) return true
                else if (parseInt(date1.substr(12, 2)) < parseInt(date2.substr(12, 2))) return false
                else
                {
                    //Compares minutes
                    if (parseInt(date1.substr(15, 2)) > parseInt(date2.substr(15, 2))) return true
                    else return false
                }
            }
        }
    }
}

//Corrects the Difficulty ranks
var good_habits_difficulty_sort = [];
function sort_good_habits_difficulty()
{
    chrome.storage.sync.get("good_habits", function(habit_streaks)
    {
        //Makes an easier way to work with the difficulty of each habit
        let entries = []
        for (let i = 0; i < habit_streaks.good_habits.length; i++)
        {
            entries.push({"ID": i, "dif": habit_streaks.good_habits[i].difficulty})
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

function update_good_habit_stats(ID)
{
    chrome.storage.sync.get("good_habits", function(habit_streaks)
    {
        //Setup
        let times_completed = 0;
        let times_failed = 0;
        let streaks = [0];
        let best_streak = 0;

        //Less typing
        let all = habit_streaks.good_habits
        let gh = all[ID]

        //iterates through the completions
        for (let i = 0; i < gh.completions.length; i++)
        {
            //if it was completed
            if (gh.completions[i].completed)
            {
                times_completed+=1;
                streaks[streaks.length-1] += 1;
            }
            //if it wasn't completed
            else
            {
                times_failed+=1;
                
                //Starts a new streak if you failed your old one
                if (streaks[streaks.length-1] != 0) streaks.push(0)
            }
        }

        for (let i = 0; i < streaks.length; i++)
        {
            if (streaks[i] > best_streak) best_streak = streaks[i];
        }   

        //Updates stats based on the data we have collected from iterating
        //try removing the parseInts to see if they're necessary
        gh.difficulty = 100-Math.floor(100*(parseInt(times_completed)/(parseInt(times_completed) + parseInt(times_failed))))
        gh.average_streak = streaks.reduce(function(a, b){return a+b})/streaks.length
        gh.best_streak = best_streak;
        gh.current_streak = streaks[streaks.length-1]
        all[ID] = gh;
        chrome.storage.sync.set({"good_habits": all});
    })
}

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

//Makes things not undefined at the start
chrome.storage.sync.get(['good_habits', 'late', 'task_list_sort'], function(habit_streaks)
{
    if (habit_streaks.good_habits == undefined) chrome.storage.sync.set({"good_habits": []})
    if (habit_streaks.late == undefined) chrome.storage.sync.set({"late": []})
    if (habit_streaks.task_list_sort == undefined) chrome.storage.sync.set({"task_list_sort": "urgency"})
})
}

//Task list
{

document.getElementById("task_list_button").onclick = function(){task_list();}

function task_list_clear()
{
    //closes popup
    document.getElementById("tabs").style.display = "block";
    document.getElementById("good_habits_div").style.display = "block";
    document.getElementById("task_list").style.display = "none";
    good_habits_tab();
}

function task_list()
{
    good_clear("task_list")

    //clears all tasks
    let tasks = document.getElementsByClassName("task_list_entry")
    while (tasks[0])
    {
        tasks[0].remove();
    }

    //Gets rid of all caught up text (it will come back later if needed)
    document.getElementById("caught_up_todo").style.display = "none";

    document.getElementById("task_list_cancel").onclick = function(){task_list_clear()}

    //Displays habits
    chrome.storage.sync.get(["task_list_sort", "good_habits"], function(habit_streaks)
    {
        //less typing
        let local_sort;

        //Sets the sort select to correct value
        local_sort = habit_streaks.task_list_sort;
        document.getElementById("task_list_sort_select").value = local_sort;

        //Keeping track of whether or not to show the "All caught up" text
        var caught_up = true

        let first = true;

        //Generates task_list based on what sort you did
        switch(local_sort)
        {
            default:
                for (let i = 0; i < habit_streaks.good_habits.length; i++)
                {
                    //less typing
                    let habit = habit_streaks.good_habits[good_habits_difficulty_sort[i]]

                    if (!habit.done_today)
                    {
                        //Only generates the task if you haven't said anything about it yet

                        //Makes the first habit closer to the top
                        if (first) 
                        {
                            first = false
                            generate_task(habit, good_habits_difficulty_sort[i], true)
                        }
                        else generate_task(habit, good_habits_difficulty_sort[i], false)

                        caught_up = false
                    }
                }
                break;
        }

        if (caught_up) document.getElementById("caught_up_todo").style.display = "block";
    })

    document.getElementById("task_list_sort_select").onchange = function()
    {
        chrome.storage.sync.set({"task_list_sort": document.getElementById("task_list_sort_select").value})
        task_list_clear();
        task_list();
    }
}

function generate_task(habit, ID, first)
{
    let task = document.createElement("div");
    task.className = "task_list_entry"
    task.style = "margin-bottom: 20px; height: 70px;";
    if (first) task.style.marginTop = "5px";
    else task.style.marginTop = "40px"

    
    let task_name = document.createElement("p");
    task_name.style = "font-size: 14px; margin-top: 0; margin-bottom: 5px; font-weight: bold;";
    task_name.innerHTML = habit.name;

    let task_completion_dates = document.createElement("p")
    task_completion_dates.style = "margin-top: 0; white-space: pre-line;"
    task_completion_dates.innerHTML = "to be completed before\n"+habit.completion_date;

    let task_completion_button = document.createElement("input");
    task_completion_button.style = "width: 75px; height: 20px;"
    task_completion_button.type = "button";
    task_completion_button.value = "done"
    task_completion_button.onclick = function()
    {
        //Records the position of scroll bar before clicking the button
        let scrollY = document.documentElement.scrollTop;

        //Updates stats
        habit_completed(ID)
        
        //Resets the page to include new info
        setTimeout(function(){task_list_clear(); task_list();}, 10);

        //Puts the page back into the original position so it looks like the page wasn't reset
        setTimeout(function(){document.documentElement.scrollTop = scrollY}, 20);
    }

    task.appendChild(task_name)
    task.appendChild(task_completion_dates)
    task.appendChild(task_completion_button)
    document.getElementById("todo_list").appendChild(task);
}
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
            if (extra == "") //New Habit page
            {
                let temp = {
                    "name": name.value,
                    "description": description.value,
                    "creation_date": new Date().toString().substr(4, 11),
                    "completion_date": new Date().toString().substr(4, 11)+" 23:59",
                    "difficulty": 0,
                    "done_today": false,
                    "completions": [],
                    "average_streak": 0,
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
            else //Habit Settings page
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

document.getElementById("good_habit_name_input").onkeyup = function()
{
    document.getElementById("good_habit_name_characters").innerHTML = (20-document.getElementById("good_habit_name_input").value.length).toString();
}
document.getElementById("good_habit_description_input").onkeyup = function()
{
    document.getElementById("good_habit_description_characters").innerHTML = (50-document.getElementById("good_habit_description_input").value.length).toString();
}

//Ending of "new Habit page"
}

//Ending of Good Habits tab (in general)
}