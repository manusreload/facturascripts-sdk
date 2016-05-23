<?php

/**
 * Created by PhpStorm.
 * User: manus
 * Date: 21/4/16
 * Time: 20:06
 */
class sdk_main extends fs_controller
{
    var $projects;
    public function __construct()
    {
        parent::__construct(__CLASS__, "Inicio", "SDK", false, true, false);

    }

    protected function private_core()
    {
        parent::private_core(); // TODO: Change the autogenerated stub
        if(isset($_GET['success']))
        {
            $this->new_message("Se ha creado correctamente");
        }
        $this->projects = $this->get_projects();
    }

    protected function get_projects()
    {
        $list = array();
        $folder = "plugins/";
        $files = scandir($folder);
        foreach ($files as $file )
        {
            if($file != "." && $file != "..")
            {
                $path = $folder . $file;
                if(file_exists($path . "/sdk.json"))
                {
                    $list[] = $this->load_project($path . "/sdk.json");
                }
            }
        }
        return $list;
    }

    public function load_project($path)
    {
        $json = json_decode(file_get_contents($path));
        $json->path = basename(dirname($path));
        return $json;

    }


}