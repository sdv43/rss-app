<?php


namespace Api\Methods;


interface Method
{
    public function do(array $params): array;
}