#include <iostream>
#include <string>

using namespace std;

struct Node {
    string data;
    Node* next;
};

void addNode(Node** head, string value) {
    Node* newNode = new Node();
    newNode->data = value;
    newNode->next = *head;
    *head = newNode;

    cout << "[LOG] Node added with value: " << value << "on the address: " << newNode << endl;
}

void displayList(Node* head) {
    cout << "\n--- MEMORY MAP LIST ---\n";
    Node* current = head;
    
    while (current != nullptr) {
        cout << "Valor: " << current->data 
             << " | Endereço Atual: " << current 
             << " | Aponta para: " << current->next << endl;
        
        current = current->next;
    }
    cout << "--------------------------------\n" << endl;
}

void freeMemory(Node* head) {
    Node* current = head;
    while (current != nullptr) {
        Node* nextNode = current->next;
        
        cout << "[DELETING] Freeing memory at address: " << current << endl;
        
        delete current;
        
        current = nextNode;
    }
}

int main() {
    Node* listHead = nullptr;

    cout << "Welcome to the Memory Map List!\n" << endl;
    cout << "=================================" << endl;
    
    addNode(&listHead, "Python_Script");
    addNode(&listHead, "Docker_Config");
    addNode(&listHead, "PostgreSQL_DB");

    displayList(listHead);

    freeMemory(listHead);

    return 0;
}
