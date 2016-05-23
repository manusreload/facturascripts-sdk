<?php
/**
 * Created by PhpStorm.
 * User: manus
 * Date: 22/4/16
 * Time: 16:10
 */


function check_permissions($path, $write, $execute = false)
{
    if($write && !is_writable($path)) return false;
    if($execute && !is_executable($path)) return false;
    return true;
}

function print_debug($args)
{
    header("Content-Type: text/plain");
    $args = func_get_args();
    foreach ($args as $arg)
    {
        print_r($arg);
        echo "\n";
    }
    die();

}

function quit($redirection = null)
{
    if($redirection) header("Location: " . $redirection);
    exit(0);
}