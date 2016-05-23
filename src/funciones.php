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
