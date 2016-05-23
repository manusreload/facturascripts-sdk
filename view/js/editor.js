$(document).ready(function()
{
    var project = getVariable("project");
    var treeGeneration = 0;
    var tabGeneration = 0;
    var lastTab = null;
    var editors = [];
    function getModeByExtension(extension)
    {
        switch (extension)
        {
            case ".php":
                return "ace/mode/php";
            case ".xml":
                return "ace/mode/xml";
            case ".css":
                return "ace/mode/css";
            case ".js":
                return "ace/mode/javascript";
            case ".html":
                return "ace/mode/smarty";
            case ".twig":
                return "ace/mode/twig";
            case ".ini":
                return "ace/mode/ini";
            case ".json":
                return "ace/mode/json";
            case ".md":
                return "ace/mode/markdown";
        }
        return "ace/mode/text";
    }

    function createFile(name)
    {

    }

    function loadTree(parent)
    {
        if(parent.target)
        {
            parent = $(this);
            $(this).unbind('click');
        }

        $parent = parent.find("ul");
        var path = $parent.data('path');
        $.getJSON('?page=sdk_edit', {project: project, action: 'list', 'path': path}, function(json)
        {
            $parent.html("");
            for(var key in json)
            {
                var item = json[key];
                var parentPath = path + "/" + item.name;
                if(item.folder)
                {
                    treeGeneration++;
                    var object = $('<li><input type="checkbox" id="' + treeGeneration + '" />' +
                        '<label for="' + treeGeneration + '" class="tree_label">' + item.name + '</label>' +
                        '<ul data-path="' + parentPath + '">(Loading...)</ul>' +
                        '</li>');
                    var newParent = object.find("ul");
                    object.click(loadTree);
                    object.appendTo($parent);
                    
                }
                else
                {
                    var object = $('<li data-path="' + parentPath +'"><span class="tree_label" >'+ item.name + '</span></li>');
                    object.click(function()
                    {
                        loadFile($(this).data('path'));
                    });
                    object.appendTo($parent);
                }
            }
        });
    }

    function getExtension(string)
    {
        return string.substring(string.lastIndexOf("."));
    }
    function loadFile(file)
    {
        $.getJSON('?page=sdk_edit', {project: project, action: 'open', 'file': file}, function(json)
        {
            openFile(file, json.data, json.cursor);
        });
    }
    function basename(string)
    {
        return string.substring(string.lastIndexOf("/") + 1);
    }
    function openFile(name, data, cursor)
    {

        var current = $("[data-file='" + name +"'");
        if(current.length == 0)
        {
            tabGeneration++;
            var tab = $('<li role="presentation" data-file="' +name+ '"><a href="#tab-' + tabGeneration + '" aria-controls="profile" role="tab" data-toggle="tab"><span class="edited hidden">*</span> ' + basename(name) +' <span class="close-tab">&times;</span></a></li>').appendTo($(".tab-head"));
            var dom = $('<pre></pre>');
            var tabContent = $('<div role="tabpanel" class="tab-pane" id="tab-' +tabGeneration+ '"></div>');
            tabContent.append(dom);
            tabContent.appendTo(".tab-content");
            var editor = ace.edit(dom[0]);
            editor.setTheme("ace/theme/twilight");
            var mode = getModeByExtension(getExtension(name));
            editor.session.setMode(mode);
            editor.setOptions({
                enableBasicAutocompletion: true,
                enableSnippets: true,
                enableLiveAutocompletion: true
            });
            editor.setValue(data, cursor);
            tab.find("a:last").on('shown.bs.tab', function (e) {
                lastTab = e.relatedTarget;
            });
            editor.getSession().on("change", function(e)
            {
                tab.find(".edited").removeClass("hidden");
            });
            tab.find(".close-tab").click(function()
            {
                if(!lastTab)
                {
                    $(lastTab).click();
                }
                tab.remove();
                tabContent.remove();
            });

            tab.bind("contextmenu", function (event) {

                // Avoid the real one
                event.preventDefault();
                
                // Show contextmenu
                var element = $(".tab-custom-menu").clone().appendTo("body").toggle(100).

                // In the right position (the mouse)
                css({
                    top: event.pageY + "px",
                    left: event.pageX + "px"
                }).focusout(function()
                {
                    element.remove();
                }).click(function()
                {
                    element.remove();
                }).focus();
            });
            tab.find("a:last").tab('show');
        }
        else {
            current.find("a").click();
        }
    }


    function getVariable(name) {
        var vars = {};
        var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m,key,value) {
            vars[key] = value;
        });
        if(name) return vars[name];
        return vars;
    }
    
    
    
    // And finally THE MAGIC!!!!!
    
    
    
    loadTree($(".tree"));
});