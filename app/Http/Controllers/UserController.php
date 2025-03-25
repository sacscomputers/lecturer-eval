<?php

namespace App\Http\Controllers;

use App\Models\User;
use Inertia\Inertia;
use Illuminate\Http\Request;

class UserController extends Controller
{
     /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $users = User::all();
        
        return Inertia::render('Auth/Users/Index', compact('users'));
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('Auth/Users/Create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreUserRequest $request)
    {
        $validatedData = $request->validated();
        $validatedData['photo'] = $request->file('photo') ? $request->file('photo')->store('users', 'public') : null;
        User::create($validatedData);

        return redirect(route('users.index', absolute: false));   
    }

    /**
     * Display the specified resource.
     */
    public function show(User $user)
    {
        return Inertia::render('Auth/Users/Show', compact('user'));
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(User $user)
    {
        return Inertia::render('Auth/Users/Edit', compact('user'));
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateUserRequest $request, User $user)
    {
        $validatedData = $request->validated();
        $validatedData['photo'] = $request->file('photo') ? $request->file('photo')->store('users', 'public') : $user->photo;
        $user->update($validatedData);

        return redirect(route('users.index', absolute: false));
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(User $user)
    {
        $user->delete();

        return Redirect::to('/users');
    }

    /**
     * Bulk upload users.
     */
    public function bulkUpload(Request $request)
    {
        $request->validate([
            'file' => 'required|mimes:csv,txt',
        ]);
    
        $path = $request->file('file')->store('uploads', 'public');
        $fullPath = storage_path('app/public/' . $path);
    
        if (($handle = fopen($fullPath, 'r')) !== false) {
            $header = fgetcsv($handle); // Read the first line as headers
    
            while (($row = fgetcsv($handle)) !== false) {
                $data = array_combine($header, $row); // Map CSV row to headers
    
                User::create([
                    'title' => $data['title'] ?? null,
                    'code' => $data['code'] ?? null,
                    'photo' => $data['photo'] ?? null, // Assuming it's a URL/path
                    'description' => $data['description'] ?? null,
                ]);
            }
    
            fclose($handle);
        }
    
        return redirect()->route('users.index')->with('success', 'Users uploaded successfully.');
    }
}
