<?php

namespace App\Http\Controllers;

use App\Models\Metric;
use App\Http\Requests\StoreMetricRequest;
use App\Http\Requests\UpdateMetricRequest;

class MetricController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $metrics = Metric::all();

        return inertia('Auth/Metrics/Index', compact('metrics'));
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return inertia('Auth/Metrics/Create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreMetricRequest $request)
    {
        $validatedData = $request->validated();
        
        Metric::create($validatedData);

        return redirect(route('metrics.index', absolute: false))->with('success', 'Metric added successfully');
    }

    /**
     * Display the specified resource.
     */
    public function show(Metric $metric)
    {
        return inertia('Auth/Metrics/Show', compact('metric'));
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Metric $metric)
    {
        return inertia('Auth/Metrics/Edit', compact('metric'));
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateMetricRequest $request, Metric $metric)
    {
        $validatedData = $request->validated();
        $metric->update($validatedData);

        return redirect(route('metrics.index', absolute: false))->with('success', 'Metric updated successfully');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Metric $metric)
    {
        $metric->delete();

        return redirect(route('metrics.index', absolute: false));
    }
}
