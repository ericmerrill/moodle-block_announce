<?php
// This file is part of Moodle - http://moodle.org/
//
// Moodle is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// Moodle is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with Moodle.  If not, see <http://www.gnu.org/licenses/>.

/**
 * A block for showing announcements.
 *
 * @package    block_announce
 * @author     Eric Merrill <merrill@oakland.edu>
 * @copyright  2014 Oakland University
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

define('AJAX_SCRIPT', true);

require_once(dirname(__FILE__) . '/../../config.php');

require_login();

$messageid = required_param('messageid', PARAM_INT);
$hide = optional_param('hide', 1, PARAM_INT);

$messages = get_user_preferences('block_announce_hidden');

if ($messages) {
    $messages = explode(',', $messages);
} else {
    $messages = array();
}

if ($hide) {
    if (($key = array_search($messageid, $messages)) === false) {
        $messages[] = $messageid;
    }
} else {
    if (($key = array_search($messageid, $messages)) !== false) {
        unset($messages[$key]);
    }
}

set_user_preference('block_announce_hidden', implode(',', $messages));
