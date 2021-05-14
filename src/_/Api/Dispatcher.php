<?php

declare(strict_types=1);


namespace Api;


class Dispatcher
{
    public function process(string $method, array $params): array
    {
        $class = __NAMESPACE__ . "\\Methods\\" . $this->generateMethodClassName($method);

        if (!class_exists($class)) {
            throw new ApiException("Method doesn't exists");
        }

        $object = new $class();

        return $object->do($params);
    }

    private function generateMethodClassName(string $method): string
    {
        if (empty($method)) {
            throw new ApiException("Method name is empty");
        }

        $arr = explode(".", $method);
        $arr = array_map("strtolower", $arr);
        $arr = array_map("ucfirst", $arr);

        return implode("", $arr);
    }
}